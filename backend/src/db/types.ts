import { Challenge } from "@shared/game";
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
  forms: VerbForms;
};

type Word = Noun | Verb;

type ActiveChallenge = Entity &
  Pick<Challenge, "hint" | "pre" | "post"> & { answer: string };

export { Word, Noun, Verb, VerbForms, Entity, ActiveChallenge, BaseWord };
