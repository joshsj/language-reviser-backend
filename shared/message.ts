import { Challenge, ChallengeCategory, Attempt, Result } from "./game";

type Named<T extends { [key: string]: {} }> = {
  [K in keyof T]: { name: K } & T[K];
};

type ClientMessages = Named<{
  newChallenge: {
    categories: ChallengeCategory[];
  };

  attempt: Attempt;
}>;

type ServerMessages = Named<{
  newChallenge: Challenge;

  attempt: { result: Result };
}>;

type ClientMessage = keyof ClientMessages;
type ServerMessage = keyof ServerMessages;

export { ClientMessage, ClientMessages, ServerMessage, ServerMessages };
