import { Challenge, ChallengeCategory, Attempt } from "./game";

type ClientMessage =
  | {
      name: "newChallenge";
      body: {
        categories: ChallengeCategory[];
      };
    }
  | { name: "attempt"; body: Attempt };

type ServerMessage =
  | { name: "newChallenge"; body: Challenge }
  | { name: "attempt"; body: { result: boolean } };

type ClientMessageName = ClientMessage["name"];
type ServerMessageName = ServerMessage["name"];

export { ClientMessage, ServerMessage, ClientMessageName, ServerMessageName };
