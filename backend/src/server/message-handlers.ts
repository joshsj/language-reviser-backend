import { Container } from "@/common/dependency/container";
import { ChallengeOptions, Word } from "@/common/entities";
import * as filters from "../data/filters";
import {
  toActiveChallenge,
  toChallenge,
  toEverythingChallenge,
} from "../data/mappers";
import { Words } from "../data/models";
import { Dependencies, MessageHandler, MessageHandlers } from "../dependency";

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
  async ({ message }) => {
    const words = container.resolve("words");
    const activeChallenges = container.resolve("activeChallenges");

    if (!(words && activeChallenges)) {
      return;
    }

    const word = await getRandomWord(words, message);

    if (!word) {
      return;
    }

    const everything = toEverythingChallenge(
      word,
      container.resolve("clientId")
    );
    await activeChallenges.create(toActiveChallenge(everything));

    return Promise.resolve({
      name: "newChallenge",
      message: toChallenge(everything),
    });
  };

const handleAttempt =
  (container: Container<Dependencies>): MessageHandler<"attempt"> =>
  async ({ message: { challengeId, attempt } }) => {
    const activeChallenges = container.resolve("activeChallenges");
    const answerChecker = container.resolve("answerChecker");

    const activeChallenge = await activeChallenges?.findOne({
      _id: challengeId,
    });

    // TODO: better error handling
    if (!(activeChallenge && activeChallenges && answerChecker)) {
      return;
    }

    const result = answerChecker(activeChallenge.answer, attempt);

    result && (await activeChallenges.deleteOne({ _id: challengeId }));

    return Promise.resolve({ name: "attempt", message: { result } });
  };

const createHandlers = (
  container: Container<Dependencies>
): MessageHandlers => ({
  newChallenge: [handleNewChallenge(container)],
  attempt: [handleAttempt(container)],
});

export { createHandlers };
