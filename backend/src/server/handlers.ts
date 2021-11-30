import {
  ClientMessage,
  ClientMessageName,
  ServerMessage,
  ServerMessageName,
} from "@shared/message";
import { Models, Words } from "../db/models";
import { checkAttempt } from "../game";
import { ActiveChallenge, Word } from "../db/types";
import { toActiveChallenge, toChallenge } from "./mappers";
import { ChallengeOptions } from "@shared/game";
import * as filters from "../db/filters";
import { _throw, _try } from "@shared/utilities";

type Handler<T extends ClientMessageName> = (
  message: Extract<ClientMessage, { name: T }>
) => Promise<
  T extends ServerMessageName
    ? Extract<ServerMessage, { name: T }> | void
    : void
>;

type Handlers = { [K in ClientMessageName]: Handler<K>[] };

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

const createHandlers = ({ words, activeChallenges }: Models): Handlers => ({
  newChallenge: [
    async ({ body }) => {
      const word = await getRandomWord(words, body);

      if (!word) {
        return;
      }

      const activeChallenge = toActiveChallenge(word);
      await activeChallenges.create(activeChallenge);

      return Promise.resolve({
        name: "newChallenge",
        body: toChallenge(activeChallenge),
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

export { createHandlers, Handlers };
