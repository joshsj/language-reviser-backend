import { NounType, NounTypes } from "@/common/language/composition";
import { random } from "@/common/utilities";
import { Converter } from ".";
import { id } from "../../data/utilities";

const nounInfo: { [K in NounType]: { pre: string; post: string | undefined } } =
  {
    masculineSingular: { pre: "le", post: undefined },
    masculinePlural: { pre: "les", post: "(m)" },
    feminineSingular: { pre: "la", post: undefined },
    femininePlural: { pre: "les", post: "(f)" },
  };

const nounConverter: Converter<"noun"> = {
  inFrench: (noun, { clientId }) => {
    const type = NounTypes[random(NounTypes.length - 1)]!;
    const _id = id();
    const answer = noun[type];
    const { pre, post } = nounInfo[type];

    return {
      _id,
      clientId,
      answer,
      pre,
      post,
      hint: noun.english,
      context: noun.context,
      challengeId: _id.toString(),
      answerLength: answer.length + random(2),
    };
  },

  inEnglish: (noun, { clientId }) => {
    const _id = id();
    const answer = noun.english;

    return {
      _id,
      clientId,
      answer,
      hint: noun["masculineSingular"],
      context: noun.context,
      challengeId: _id.toString(),
      answerLength: answer.length + random(2),
    };
  },
};

export { nounConverter };
