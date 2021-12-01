import { BaseWord } from "../types";
import { modelOptions, prop } from "@typegoose/typegoose";
import { IModelOptions } from "@typegoose/typegoose/lib/types";
import { Types } from "mongoose";
import { Entity } from "./entity";

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
  @prop()
  _id!: Types.ObjectId;

  readonly type!: TType;

  @prop({ required })
  english!: string;

  @prop({ type: String })
  context: string | undefined;
}

export { WordSchema };
