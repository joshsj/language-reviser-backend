import { Logger } from "@/common/dependency";
import {
  ClientMessageName,
  ClientMessage,
  ServerMessageName,
  ServerMessage,
} from "@/common/messages";
import { ActiveChallenges, Words } from "./data/models";
import { AnswerChecker } from "@/common/dependency";
import { ClientId } from "./data/entities";

type MessageHandler<T extends ClientMessageName> = (
  message: Extract<ClientMessage, { name: T }>,
  session: Session
) => Promise<
  T extends ServerMessageName
    ? Extract<ServerMessage, { name: T }> | void
    : void
>;

type MessageHandlers = { [K in ClientMessageName]: MessageHandler<K>[] };

type Session = { clientId?: ClientId };

type Dependencies = {
  words?: Words;
  activeChallenges?: ActiveChallenges;
  messageHandlers?: MessageHandlers;
  answerChecker?: AnswerChecker;
  logger?: Logger;
};

export { MessageHandler, MessageHandlers, Dependencies, Session };
