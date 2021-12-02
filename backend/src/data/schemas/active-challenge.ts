import { modelOptions, prop } from "@typegoose/typegoose";
import { IModelOptions } from "@typegoose/typegoose/lib/types";
import { ActiveChallenge, ClientId } from "../entities";
import { Entity } from "./entity";

const options: IModelOptions = {
  schemaOptions: {
    collection: "activeChallenges",
  },
};

@modelOptions(options)
class ActiveChallengeSchema extends Entity implements ActiveChallenge {
  @prop({ required: true })
  answer!: string;

  @prop({ type: String })
  clientId: ClientId | undefined;
}

export { ActiveChallengeSchema };
