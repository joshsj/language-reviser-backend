import { Challenge, ChallengeCategory, Attempt, Result } from "./game";

type Named<T> = {
  [K in keyof T]: { name: K } & T[K];
};

type Requests = Named<{
  newChallenge: {
    categories: ChallengeCategory[];
  };

  attempt: Attempt;
}>;

type Responses = Named<{
  newChallenge: Challenge;

  attempt: { result: Result };
}>;

type Request = keyof Requests;
type Response = keyof Responses;

export { Request, Requests, Response, Responses };
