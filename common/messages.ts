import { AnswerStatus } from "./dependency";
import { Attempt, Challenge, ChallengeOptions, Skip, Word } from "./entities";

type ClientMessage =
  | {
      name: "newChallenge";
      message: ChallengeOptions;
    }
  | { name: "attempt"; message: Attempt }
  | { name: "createWord"; message: Word }
  | { name: "skip"; message: Skip };

type ServerMessage =
  | { name: "newChallenge"; message: Challenge }
  | { name: "attempt"; message: { result: AnswerStatus } }
  | { name: "skip"; message: { answer: string } };

type ClientMessageName = ClientMessage["name"];
type ServerMessageName = ServerMessage["name"];

export { ClientMessage, ServerMessage, ClientMessageName, ServerMessageName };
