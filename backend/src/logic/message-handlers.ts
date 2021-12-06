import { Container } from "@/common/dependency/container";
import { ChallengeOptions, Word } from "@/common/entities";
import { Entity } from "../data/entities";
import * as filters from "../data/filters";
import { Words } from "../data/models";
import { id } from "../data/utilities";
import { Dependencies, MessageHandler, MessageHandlers } from "../dependency";
import {
  toEverythingChallenge,
  toActiveChallenge,
  toChallenge,
} from "./converters";

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
  async ({ message }, session) => {
    const words = container.resolve("words");
    const activeChallenges = container.resolve("activeChallenges");

    if (!(words && activeChallenges)) {
      return;
    }

    const word = await getRandomWord(words, message);

    if (!word) {
      return;
    }

    const everything = toEverythingChallenge(word, session);
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

    const status = answerChecker(activeChallenge.answer, attempt);

    status === "correct" &&
      (await activeChallenges.deleteOne({ _id: challengeId }));

    return Promise.resolve({ name: "attempt", message: { result: status } });
  };

const handleCreateWord =
  (container: Container<Dependencies>): MessageHandler<"createWord"> =>
  async ({ message: word }) => {
    const words = container.resolve("words");

    if (!words) {
      return;
    }

    const entity: Entity<Word> = { ...word, _id: id() };

    words.create(entity);
  };

const handleSkip =
  (container: Container<Dependencies>): MessageHandler<"skip"> =>
  ({ message: { challengeId } }) => {
    container.resolve("activeChallenges")?.deleteOne({ _id: challengeId });
    return Promise.resolve();
  };

const createHandlers = (
  container: Container<Dependencies>
): MessageHandlers => ({
  newChallenge: [handleNewChallenge(container)],
  attempt: [handleAttempt(container)],
  createWord: [handleCreateWord(container)],
  skip: [handleSkip(container)],
});

export { createHandlers };
