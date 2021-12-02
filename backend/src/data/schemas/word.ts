import { modelOptions, prop } from "@typegoose/typegoose";
import { IModelOptions } from "@typegoose/typegoose/lib/types";
import { Entity } from "./entity";
import { BaseWord } from "@/common/entities";

const required = true;

const options: IModelOptions = {
  schemaOptions: {
    collection: "words",
    discriminatorKey: "type",
  },
};

@modelOptions(options)
class WordSchema<TType extends string>
  extends Entity
  implements BaseWord<TType>
{
  readonly type!: TType;

  @prop({ required })
  english!: string;

  @prop({ type: String })
  context: string | undefined;
}

export { WordSchema };
