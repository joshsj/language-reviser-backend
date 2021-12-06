import { Subjects } from "@/common/language/composition";
import { random } from "@/common/utilities";
import { Converter } from ".";
import { id } from "../../data/utilities";

const verbConverter: Converter<"verb"> = {
  inEnglish: (verb, { clientId }) => {
    const subject = Subjects[random(Subjects.length - 1)]!;
    const _id = id();
    const answer = verb.forms[subject];

    return {
      _id,
      clientId,
      answer,
      hint: verb.english,
      pre: subject,
      challengeId: _id.toString(),
      answerLength: answer.length + random(2),
      context: verb.context,
    };
  },

  inFrench: (verb, { clientId }) => {
    const _id = id();
    const answer = verb.infinitive;

    return {
      _id,
      clientId,
      answer,
      hint: verb.english,
      pre: "to",
      challengeId: _id.toString(),
      answerLength: answer.length + random(2),
      context: verb.context,
    };
  },
};

export { verbConverter };
