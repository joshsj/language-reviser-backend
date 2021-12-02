import { Logger } from "@/common/dependency";
import {
  ClientMessageName,
  ClientMessage,
  ServerMessageName,
  ServerMessage,
} from "@/common/messages";
import { ActiveChallenges, Words } from "./data/models";
import { AnswerChecker } from "@/common/dependency";

type MessageHandler<T extends ClientMessageName> = (
  message: Extract<ClientMessage, { name: T }>
) => Promise<
  T extends ServerMessageName
    ? Extract<ServerMessage, { name: T }> | void
    : void
>;

type MessageHandlers = { [K in ClientMessageName]: MessageHandler<K>[] };

type Dependencies = {
  clientId?: string;
  answerChecker?: AnswerChecker;
  words?: Words;
  activeChallenges?: ActiveChallenges;
  messageHandlers?: MessageHandlers;
  logger?: Logger;
};

export { MessageHandler, MessageHandlers, Dependencies };
