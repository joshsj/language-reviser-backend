import { Challenge, ChallengeCategory } from "./game";
import { Named } from "./utilities";

type Messages = {
  newChallenge: {
    request: {
      categories: ChallengeCategory[];
    };
    response: Challenge;
  };
};

type Message = keyof Messages;

type Presentation = {
  [K in Message]: (
    request: Messages[K]["request"] & Named<K>
  ) => Messages[K]["response"] & Named<K>;
};

export { Presentation, Message };
