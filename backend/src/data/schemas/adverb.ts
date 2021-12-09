import { Adverb } from "@/common/entities";
import { AdverbOf } from "@/common/language/composition";
import { prop } from "@typegoose/typegoose";
import { WordSchema } from "./word";

const required = true;

class AdverbSchema extends WordSchema<"adverb"> implements Adverb {
  @prop({ required })
  french!: string;

  @prop({ required, type: String })
  of!: AdverbOf;
}

export { AdverbSchema };
