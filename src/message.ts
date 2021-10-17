import { Challenge, ChallengeCategory } from "./game";
import { Named } from "./utilities";

type _Requests = {
  newChallenge: { categories: ChallengeCategory[] };
};

type _Responses = {
  newChallenge: Challenge;
};

type Message = keyof (_Requests | _Responses);

type Requests = { [E in Message]: _Requests[E] & Named<E> };
type Responses = { [E in Message]: _Responses[E] & Named<E> };

export { Message, Requests, Responses };
