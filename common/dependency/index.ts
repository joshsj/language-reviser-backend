import { ServerMessageName, ServerMessage, ClientMessage } from "../messages";

type LoggerMode = "info" | "good" | "bad";
type Logger = (s: string, mode?: LoggerMode) => void;

type Direction = "next" | "previous";

type AccentHelper = {
  get: (char: string, d: Direction) => string;
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

type AnswerChecker = (attempt: string, answer: string) => boolean;

export {
  LoggerMode,
  Logger,
  AccentHelper,
  Direction,
  MessageHandler,
  Messenger,
  AnswerChecker,
};
