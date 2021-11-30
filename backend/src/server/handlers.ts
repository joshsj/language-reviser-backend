import { validateAttempt } from "@shared/game";
import {
  ClientMessage,
  ClientMessageName,
  ServerMessage,
  ServerMessageName,
} from "@shared/message";

type Handler<T extends ClientMessageName> = (
  message: Extract<ClientMessage, { name: T }>
) => T extends ServerMessageName ? Extract<ServerMessage, { name: T }> : void;

type Handlers = {
  [K in ClientMessageName]: Handler<K>[];
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
});

export { createHandlers, Handlers };
