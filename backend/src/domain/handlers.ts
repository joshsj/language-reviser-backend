import { ChallengeOptions, Word } from "@/common/entities";
import { Dependencies, MessageHandler, MessageHandlers } from "../dependency";
import { Words } from "../data/models";
import { checkAttempt } from "./game";
import {
  toEverythingChallenge,
  toActiveChallenge,
  toChallenge,
} from "../data/mappers";
import * as filters from "../data/filters";
import { Container } from "../dependency/container";

const getRandomWord = async (
  words: Words,
  options: ChallengeOptions
): Promise<Word | undefined> =>
  (
    await words.aggregate([
      { $match: filters.challengeOptions(options) },
      { $sample: { size: 1 } },
    ])
  )[0];

const handleNewChallenge =
  (container: Container<Dependencies>): MessageHandler<"newChallenge"> =>
  async ({ body }) => {
    const words = container.resolve("words");
    const activeChallenges = container.resolve("activeChallenges");

    if (!(words && activeChallenges)) {
      return;
    }

    const word = await getRandomWord(words, body);

    if (!word) {
      return;
    }

    const everything = toEverythingChallenge(word);
    await activeChallenges.create(toActiveChallenge(everything));

    return Promise.resolve({
      name: "newChallenge",
      body: toChallenge(everything),
    });
  };

const handleAttempt =
  (container: Container<Dependencies>): MessageHandler<"attempt"> =>
  async ({ body: { challengeId, attempt } }) => {
    const activeChallenges = container.resolve("activeChallenges");

    const activeChallenge = await activeChallenges?.findOne({
      _id: challengeId,
    });

    // TODO: better error handling
    if (!(activeChallenge && activeChallenges)) {
      return;
    }

    const result = checkAttempt(activeChallenge.answer, attempt);

    result && (await activeChallenges.deleteOne({ _id: challengeId }));

    return Promise.resolve({ name: "attempt", body: { result } });
  };

const createHandlers = (
  container: Container<Dependencies>
): MessageHandlers => ({
  newChallenge: [handleNewChallenge(container)],
  attempt: [handleAttempt(container)],
});

export { createHandlers };
