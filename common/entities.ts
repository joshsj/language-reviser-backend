import { AdjectiveType, AdverbOf, Subject } from "./language/composition";

const WordCategories = ["people", "ordering", "directions"] as const;
type WordCategory = typeof WordCategories[number];

type BaseWord<TType extends string> = {
  type: TType;
  english: string;
  context?: string;
  categories: WordCategory[];
};

type Adjective = BaseWord<"adjective"> & {
  [K in AdjectiveType]: string;
};

type VerbForms = { [K in Subject]: string };

type Verb = BaseWord<"verb"> & {
  infinitive: string;
  regular: boolean;
  forms: VerbForms;
};

type Adverb = BaseWord<"adverb"> & { french: string; of: AdverbOf };

type Word = Adjective | Verb | Adverb;

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

type ChallengeOptions = {
  categories?: WordCategory[];

  verb?: VerbOptions;
  adjective?: boolean;
  adverbs?: boolean;
};

export {
  WordCategory,
  WordCategories,
  BaseWord,
  Word,
  VerbForms,
  Verb,
  Adverb,
  Adjective,
  AdjectiveType,
  Attempt,
  VerbOptions,
  Skip,
  Challenge,
  ChallengeOptions,
};
