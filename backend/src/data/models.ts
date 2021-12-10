import { getModelForClass, getDiscriminatorModelForClass } from "@typegoose/typegoose";
import { AnyParamConstructor, BeAnObject, ReturnModelType } from "@typegoose/typegoose/lib/types";
import { ActiveChallengeSchema } from "./schemas/active-challenge";

import { AdjectiveSchema } from "./schemas/adjective";
import { AdverbSchema } from "./schemas/adverb";
import { VerbSchema } from "./schemas/verb";
import { WordSchema } from "./schemas/word";

type SchemaType<T extends AnyParamConstructor<any>> = ReturnModelType<T, BeAnObject>;

type Words = SchemaType<typeof WordSchema>;
type ActiveChallenges = SchemaType<typeof ActiveChallengeSchema>;

type Models = { words: Words; activeChallenges: ActiveChallenges };

const createModels = (): Models => {
  const WordModel: Words = getModelForClass(WordSchema);

  getDiscriminatorModelForClass(WordModel, AdjectiveSchema, "adjective");
  getDiscriminatorModelForClass(WordModel, VerbSchema, "verb");
  getDiscriminatorModelForClass(WordModel, AdverbSchema, "adverb");

  const ActiveChallengeModel: ActiveChallenges = getModelForClass(ActiveChallengeSchema);

  return { words: WordModel, activeChallenges: ActiveChallengeModel };
};

export { createModels, Models, Words, ActiveChallenges };
