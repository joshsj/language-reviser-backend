import { Gender, Noun, Verb, BaseWord, VerbForms } from "@shared/language";
import {
  getModelForClass,
  getDiscriminatorModelForClass,
  modelOptions,
  prop,
} from "@typegoose/typegoose";
import { IModelOptions } from "@typegoose/typegoose/lib/types";

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

  @prop()
  context?: string;
}

const WordModel = getModelForClass(WordSchema);

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
getDiscriminatorModelForClass(WordModel, NounSchema, "noun");

class VerbSchema extends WordSchema<"verb"> implements Verb {
  @prop({ required })
  infinitive!: string;

  @prop()
  irregularForms: VerbForms | undefined;
}
getDiscriminatorModelForClass(WordModel, VerbSchema, "verb");

export { WordModel };
