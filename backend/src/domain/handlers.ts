import { ChallengeOptions } from "@shared/message";
import { MessageHandlers } from "../dependency";
import { Models, Words } from "../database/models";
import { Word, ActiveChallenge } from "../database/types";
import { checkAttempt } from "./game";
import {
  toEverythingChallenge,
  toActiveChallenge,
  toChallenge,
} from "../server/mappers";
import * as filters from "../database/filters";

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

const createHandlers = ({
  words,
  activeChallenges,
}: Models): MessageHandlers => ({
  newChallenge: [
    async ({ body }) => {
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
    },
  ],

  attempt: [
    async ({ body: { challengeId, attempt } }) => {
      const activeChallenge: ActiveChallenge | null =
        await activeChallenges.findOne({ _id: challengeId });

      // TODO: better error handling
      if (!activeChallenge) {
        return;
      }

      const result = checkAttempt(activeChallenge.answer, attempt);

      result && (await activeChallenges.deleteOne({ _id: challengeId }));

      return Promise.resolve({ name: "attempt", body: { result } });
    },
  ],
});

export { createHandlers };
