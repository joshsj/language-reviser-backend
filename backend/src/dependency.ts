import {
  ClientMessage,
  ClientMessages,
  ServerMessage,
  ServerMessages,
} from "@shared/message";

type Handlers = {
  [K in ClientMessage]: (
    request: ClientMessages[K]
  ) => K extends ServerMessage ? ServerMessages[K] : void;
};

export { Handlers };
