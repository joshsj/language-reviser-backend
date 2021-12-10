import { Adverb } from "@/common/entities";
import { Converter } from ".";
import { id } from "../../data/utilities";
import { getAnswerLength } from "./utilities";

const base = (adverb: Adverb, clientId: string | undefined, direction: keyof Converter<any>) => {
  console.log(adverb);

  const _id = id();
  let [answer, hint] = [adverb.english, adverb.french];
  direction === "inFrench" && ([answer, hint] = [hint, answer]);

  return {
    _id,
    answer,
    clientId,
    hint,
    challengeId: _id.toString(),
    answerLength: getAnswerLength(answer),
    context: adverb.of,
  };
};

const adverbConverter: Converter<"adverb"> = {
  inEnglish: (adverb, { clientId }) => base(adverb, clientId, "inEnglish"),
  inFrench: (adverb, { clientId }) => base(adverb, clientId, "inFrench"),
};

export { adverbConverter };
