import { Challenge, Noun, Verb, Word } from "@/common/entities";
import { NounType, NounTypes, Subjects } from "@/common/language/composition";
import { random } from "@/common/utilities";
import { Types } from "mongoose";
import { ActiveChallenge } from "../database/entities";

type EverythingChallenge = Challenge & ActiveChallenge;

const newId = () => new Types.ObjectId();

const nounInfo: { [K in NounType]: { pre: string; post: string | undefined } } =
  {
    masculineSingular: { pre: "le", post: undefined },
    masculinePlural: { pre: "les", post: "(m)" },
    feminineSingular: { pre: "la", post: undefined },
    femininePlural: { pre: "les", post: "(f)" },
  };

type Converters = {
  [K in Word["type"]]: (
    word: Extract<Word, { type: K }>
  ) => EverythingChallenge;
};
const converters: Converters = {
  noun: (noun: Noun): EverythingChallenge => {
    const type = NounTypes[random(NounTypes.length)]!;
    const _id = newId();
    const answer = noun[type];
    const { pre, post } = nounInfo[type];

    return {
      _id,
      answer,
      challengeId: _id.toString(),
      hint: noun.english,
      pre,
      post,
      answerLength: answer.length + random(2),
      context: noun.context,
    };
  },

  verb: (verb: Verb): EverythingChallenge => {
    const subject = Subjects[random(Subjects.length)]!;
    const _id = newId();
    const answer = verb.forms[subject];

    return {
      _id,
      answer,
      challengeId: _id.toString(),
      hint: verb.infinitive,
      pre: subject,
      answerLength: answer.length + random(2),
      context: verb.context,
    };
  },
};

const toEverythingChallenge = (word: Word): EverythingChallenge =>
  // I wish this worked how I want it to
  converters[word.type](word as any);

const toActiveChallenge = ({
  _id,
  answer,
}: EverythingChallenge): ActiveChallenge => ({ _id, answer });

// Explicit to ensure properties like 'Answer' aren't exposed
const toChallenge = ({
  hint,
  pre,
  post,
  context,
  challengeId,
  answerLength,
}: EverythingChallenge): Challenge => ({
  hint,
  pre,
  post,
  context,
  challengeId,
  answerLength,
});

export { toEverythingChallenge, toActiveChallenge, toChallenge };
