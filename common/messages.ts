import { Attempt, Challenge, ChallengeOptions } from "./entities";

type ClientMessage =
  | {
      name: "newChallenge";
      message: ChallengeOptions;
    }
  | { name: "attempt"; message: Attempt };

type ServerMessage =
  | { name: "newChallenge"; message: Challenge }
  | { name: "attempt"; message: { result: boolean } };

type ClientMessageName = ClientMessage["name"];
type ServerMessageName = ServerMessage["name"];

export { ClientMessage, ServerMessage, ClientMessageName, ServerMessageName };
