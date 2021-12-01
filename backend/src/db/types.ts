import { Subject, Gender, NounType } from "@shared/language";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";

type Entity = Pick<Base, "_id">;

type BaseWord<TType extends string> = Entity & {
  type: TType;
  english: string;
  context?: string;
};

type Noun = BaseWord<"noun"> & { gender: Gender } & { [K in NounType]: string };

type VerbForms = { [K in Subject]: string };

type Verb = BaseWord<"verb"> & {
  infinitive: string;
  regular: boolean;
  forms: VerbForms;
};

type Word = Noun | Verb;

type ActiveChallenge = Entity & { answer: string };

export { Word, Noun, Verb, VerbForms, Entity, ActiveChallenge, BaseWord };
