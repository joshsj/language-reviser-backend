import { AdjectiveType, AdjectiveTypes } from "@/common/language/composition";
import { random } from "@/common/utilities";
import { Converter } from ".";
import { id } from "../../data/utilities";

const adjectivePre: {
  [K in AdjectiveType]: string;
} = {
  masculineSingular: "(ms)",
  masculinePlural: "(mp)",
  feminineSingular: "(fs)",
  femininePlural: "(fp)",
};

const adjectiveConverter: Converter<"adjective"> = {
  inFrench: (adjective, { clientId }) => {
    const type = AdjectiveTypes[random(AdjectiveTypes.length - 1)]!;
    const _id = id();
    const answer = adjective[type];
    const pre = adjectivePre[type];

    return {
      _id,
      clientId,
      answer,
      pre,
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
