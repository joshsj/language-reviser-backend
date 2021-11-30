import { Challenge } from "@shared/game";
import { NounType, NounTypes, Subjects } from "@shared/language";
import { random } from "@shared/utilities";
import { Types } from "mongoose";
import { Word, ActiveChallenge, Noun, Verb } from "../db/types";

const nounPre: { [K in NounType]: string } = {
  masculineSingular: "le",
  masculinePlural: "les (m)",
  feminineSingular: "la",
  femininePlural: "les (f)",
};

type Converters = {
  [K in Word["type"]]: (word: Extract<Word, { type: K }>) => ActiveChallenge;
};
const converters: Converters = {
  noun: (noun: Noun): ActiveChallenge => {
    const type = NounTypes[random(NounTypes.length)]!;

    return {
      _id: new Types.ObjectId(),
      answer: noun[type],
      hint: noun.english,
      pre: nounPre[type],
    };
  },

  verb: (verb: Verb): ActiveChallenge => {
    const subject = Subjects[random(Subjects.length)]!;

    return {
      _id: new Types.ObjectId(),
      answer: verb.forms[subject],
      hint: verb.infinitive,
      pre: subject,
    };
  },
};

const toActiveChallenge = (word: Word): ActiveChallenge =>
  // I wish this worked how I want it to
  converters[word.type](word as any);

const toChallenge = ({
  _id,
  hint,
  pre,
  post,
  answer,
}: ActiveChallenge): Challenge => ({
  hint,
  pre,
  post,
  // TODO: work out a bette way to serialize these things
  challengeId: _id.toString(),
  // an exact length would provide information about the answer
  answerLength: answer.length + 1 + random(2),
});

export { toChallenge, toActiveChallenge };
