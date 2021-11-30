import { modelOptions, prop } from "@typegoose/typegoose";
import { IModelOptions } from "@typegoose/typegoose/lib/types";
import { ActiveChallenge } from "../types";

const options: IModelOptions = {
  schemaOptions: {
    collection: "activeChallenges",
  },
};

@modelOptions(options)
class ActiveChallengeSchema implements ActiveChallenge {
  @prop({ required: true })
  answer!: string;

  @prop({ type: String })
  hint?: string;

  @prop({ type: String })
  pre?: string;

  @prop({ type: String })
  post?: string;
}

export { ActiveChallengeSchema };
