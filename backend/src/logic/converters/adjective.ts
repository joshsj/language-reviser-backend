import { AdjectiveType, AdjectiveTypes } from "@/common/language/composition";
import { random } from "@/common/utilities";
import { Converter } from ".";
import { id } from "../../data/utilities";

const adjectiveInfo: {
  [K in AdjectiveType]: { pre: string; post: string | undefined };
} = {
  masculineSingular: { pre: "le", post: undefined },
  masculinePlural: { pre: "les", post: "(m)" },
  feminineSingular: { pre: "la", post: undefined },
  femininePlural: { pre: "les", post: "(f)" },
};

const adjectiveConverter: Converter<"adjective"> = {
  inFrench: (adjective, { clientId }) => {
    const type = AdjectiveTypes[random(AdjectiveTypes.length - 1)]!;
    const _id = id();
    const answer = adjective[type];
    const { pre, post } = adjectiveInfo[type];

    return {
      _id,
      clientId,
      answer,
      pre,
      post,
      hint: adjective.english,
      context: adjective.context,
      challengeId: _id.toString(),
      answerLength: answer.length + random(2),
    };
  },

  inEnglish: (adjective, { clientId }) => {
    const _id = id();
    const answer = adjective.english;

    return {
      _id,
      clientId,
      answer,
      hint: adjective["masculineSingular"],
      context: adjective.context,
      challengeId: _id.toString(),
      answerLength: answer.length + random(2),
    };
  },
};

export { adjectiveConverter };
