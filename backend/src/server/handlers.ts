import { validateAttempt } from "@shared/game";
import {
  ClientMessage,
  ClientMessages,
  ServerMessage,
  ServerMessages,
} from "@shared/message";

type Handler<T extends ClientMessage> = (
  request: ClientMessages[T]
) => T extends ServerMessage ? ServerMessages[T] : void;

type Handlers = {
  [K in ClientMessage]: Handler<K>[];
};

const createHandlers = (): Handlers => ({
  newChallenge: [
    () => ({
      name: "newChallenge",
      body: {
        answer: "suis",
        hint: "être",
        pre: "je",
        post: "fatigué",
      },
    }),
  ],

  attempt: [
    ({ body }) => ({
      name: "attempt",
      body: { result: validateAttempt(body) },
    }),
  ],

  accents: [
    () => ({
      name: "accents",
      body: {
        a: ["à", "â"],
        e: ["é", "ê", "è", "ë"],
        i: ["î", "ï"],
        o: ["ô"],
        u: ["ù", "û", "ü"],
      },
    }),
  ],
});

export { createHandlers, Handlers };
