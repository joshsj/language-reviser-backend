import { Challenge } from "@shared/game";
import { Subject, Gender, NounType } from "@shared/language";

type BaseWord<TType extends string> = {
  type: TType;
  english: string;
  context?: string;
};

type Noun = BaseWord<"noun"> & { gender: Gender } & { [K in NounType]: string };

type VerbForms = { [K in Subject]: string };

type Verb = BaseWord<"verb"> & {
  infinitive: string;
  forms: VerbForms;
};

type Word = Noun | Verb;

type ActiveChallenge = Challenge & { answer: string };

export { Word, Noun, Verb, VerbForms, ActiveChallenge, BaseWord };
