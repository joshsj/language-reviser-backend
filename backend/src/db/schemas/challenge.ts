import { prop } from "@typegoose/typegoose";
import { ActiveChallenge } from "../message";

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
