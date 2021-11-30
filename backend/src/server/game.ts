import { NounType, NounTypes, Subjects } from "@shared/language";
import { Word, ActiveChallenge, Noun, Verb } from "../db/types";

// TODO: tidy, TS doesn't like 'as const' declaration
const random = (n: number) => Math.round(Math.random() * (n - 1));

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
      answer: noun[type],
      hint: noun.english,
      pre: nounPre[type],
    };
  },

  verb: (verb: Verb): ActiveChallenge => {
    const subject = Subjects[random(Subjects.length)]!;

    return {
      answer: verb.forms[subject],
      hint: verb.infinitive,
      pre: subject,
    };
  },
};

const toActiveChallenge = (word: Word): ActiveChallenge =>
  // I wish this worked how I want it to
  converters[word.type](word as any);

export { toActiveChallenge };
