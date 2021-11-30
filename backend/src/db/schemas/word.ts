import { BaseWord } from "@shared/language";
import { modelOptions, prop } from "@typegoose/typegoose";
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

  @prop({ type: String })
  context: string | undefined;
}

export { WordSchema };
