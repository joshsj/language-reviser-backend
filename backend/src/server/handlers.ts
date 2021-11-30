import { Models } from "../db/models";
import { toActiveChallenge } from "./game";
import { Word } from "@shared/language";
import {
  ClientMessage,
  ClientMessageName,
  ServerMessage,
  ServerMessageName,
} from "@shared/message";

type Handler<T extends ClientMessageName> = (
  message: Extract<ClientMessage, { name: T }>
) => Promise<
  T extends ServerMessageName ? Extract<ServerMessage, { name: T }> : void
>;

type Handlers = {
  [K in ClientMessageName]: Handler<K>[];
};

const createHandlers = ({ Words }: Models): Handlers => ({
  newChallenge: [
    async () => {
      const word: Word = (await Words.aggregate([{ $sample: { size: 1 } }]))[0];
      console.log(word);

      return Promise.resolve({
        name: "newChallenge",
        body: toActiveChallenge(word),
      });
    },
  ],

  attempt: [
    () =>
      Promise.resolve({
        name: "attempt",
        // TODO: implement
        body: { result: Math.random() > 0.25 },
      }),
  ],
});

export { createHandlers, Handlers };
