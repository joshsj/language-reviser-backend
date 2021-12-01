import {
  ClientMessageName,
  ClientMessage,
  ServerMessageName,
  ServerMessage,
} from "@shared/message";

type MessageHandler<T extends ClientMessageName> = (
  message: Extract<ClientMessage, { name: T }>
) => Promise<
  T extends ServerMessageName
    ? Extract<ServerMessage, { name: T }> | void
    : void
>;

type MessageHandlers = { [K in ClientMessageName]: MessageHandler<K>[] };

type Env = {
  socketPort: number;
  mongoDatabase: string;
  mongoHost: string;
  mongoPort: number;
};

export { MessageHandler, MessageHandlers, Env };
