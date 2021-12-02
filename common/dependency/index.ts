import { ServerMessageName, ServerMessage, ClientMessage } from "../messages";

type LoggerMode = "info" | "good" | "bad";
type Logger = (s: string, mode?: LoggerMode) => void;

type AccentHelper = {
  next: (char: string) => string;
};

type MessageHandler<T extends ServerMessageName> = (
  message: Extract<ServerMessage, { name: T }>
) => void;

type Messenger = {
  publish: (message: ClientMessage) => Messenger;

  subscribe: <T extends ServerMessageName>(
    name: T,
    callback: MessageHandler<T>
  ) => Messenger;
};

export { LoggerMode, Logger, AccentHelper, MessageHandler, Messenger };
