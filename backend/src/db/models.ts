import { Gender, Noun, Verb, BaseWord, VerbForms } from "@shared/language";
import {
  getModelForClass,
  getDiscriminatorModelForClass,
  modelOptions,
  prop,
} from "@typegoose/typegoose";
import {
  BeAnObject,
  IModelOptions,
  ReturnModelType,
} from "@typegoose/typegoose/lib/types";

const required = true;

const baseOptions: IModelOptions = {
  schemaOptions: {
    collection: "word",
    discriminatorKey: "type",
  },
};

@modelOptions(baseOptions)
class WordSchema<TType extends string> implements BaseWord<TType> {
  readonly type!: TType;

  @prop({ required })
  english!: string;

  @prop({ type: String })
  context: string | undefined;
}

class NounSchema extends WordSchema<"noun"> implements Noun {
  @prop({ required })
  gender!: Gender;

  @prop({ required })
  masculineSingular!: string;

  @prop({ required })
  masculinePlural!: string;

  @prop({ required })
  feminineSingular!: string;

  @prop({ required })
  femininePlural!: string;
}

class VerbSchema extends WordSchema<"verb"> implements Verb {
  @prop({ required })
  infinitive!: string;

  @prop()
  irregularForms: VerbForms | undefined;
}

type Words = ReturnModelType<typeof WordSchema, BeAnObject>;

const createModels = (): Words => {
  const WordModel = getModelForClass(WordSchema);
  getDiscriminatorModelForClass(WordModel, NounSchema, "noun");
  getDiscriminatorModelForClass(WordModel, VerbSchema, "verb");

  return WordModel;
};

export { createModels, Words };
