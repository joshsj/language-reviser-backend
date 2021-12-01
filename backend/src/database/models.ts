import {
  getModelForClass,
  getDiscriminatorModelForClass,
} from "@typegoose/typegoose";
import { BeAnObject, ReturnModelType } from "@typegoose/typegoose/lib/types";
import { ActiveChallengeSchema } from "./schemas/active-challenge";

import { NounSchema } from "./schemas/noun";
import { VerbSchema } from "./schemas/verb";
import { WordSchema } from "./schemas/word";

type Words = ReturnModelType<typeof WordSchema, BeAnObject>;
type ActiveChallenges = ReturnModelType<
  typeof ActiveChallengeSchema,
  BeAnObject
>;

type Models = { words: Words; activeChallenges: ActiveChallenges };

const createModels = (): Models => {
  const WordModel: Words = getModelForClass(WordSchema);
  getDiscriminatorModelForClass(WordModel, NounSchema, "noun");
  getDiscriminatorModelForClass(WordModel, VerbSchema, "verb");

  const ActiveChallengeModel: ActiveChallenges = getModelForClass(
    ActiveChallengeSchema
  );

  return { words: WordModel, activeChallenges: ActiveChallengeModel };
};

export { createModels, Models, Words, ActiveChallenges };
