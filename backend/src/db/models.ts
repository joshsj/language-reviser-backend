import {
  getModelForClass,
  getDiscriminatorModelForClass,
} from "@typegoose/typegoose";
import { BeAnObject, ReturnModelType } from "@typegoose/typegoose/lib/types";

import { NounSchema } from "./schemas/noun";
import { VerbSchema } from "./schemas/verb";
import { WordSchema } from "./schemas/word";

type Words = ReturnModelType<typeof WordSchema, BeAnObject>;

const createModels = (): Words => {
  const WordModel = getModelForClass(WordSchema);
  getDiscriminatorModelForClass(WordModel, NounSchema, "noun");
  getDiscriminatorModelForClass(WordModel, VerbSchema, "verb");

  return WordModel;
};

export { createModels, Words };
