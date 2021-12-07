import { Gender, NounType, Subject } from "./language/composition";

const WordCategories = ["people"] as const;
type WordCategory = typeof WordCategories[number];

type BaseWord<TType extends string> = {
  type: TType;
  english: string;
  context?: string;
  categories: WordCategory[];
};

type Noun = BaseWord<"noun"> & { gender: Gender } & { [K in NounType]: string };

type VerbForms = { [K in Subject]: string };

type Verb = BaseWord<"verb"> & {
  infinitive: string;
  regular: boolean;
  forms: VerbForms;
};

type Word = Noun | Verb;

type Challenge = {
  challengeId: string;
  answerLength: number;
  hint?: string;
  pre?: string;
  post?: string;
  context?: string;
};

type Skip = { challengeId: string };
type Attempt = Skip & { attempt: string };

type VerbOptions = { regular: boolean; irregular: boolean };
type NounOptions = {};

type ChallengeOptions = {
  verb?: VerbOptions;
  noun?: NounOptions;
};

export {
  WordCategory,
  WordCategories,
  BaseWord,
  Word,
  VerbForms,
  Verb,
  Noun,
  Attempt,
  VerbOptions,
  NounOptions,
  Skip,
  Challenge,
  ChallengeOptions,
};
