import { prop } from "@typegoose/typegoose";
import { Adjective } from "@/common/entities";
import { WordSchema } from "./word";

const required = true;

class AdjectiveSchema extends WordSchema<"adjective"> implements Adjective {
  @prop({ required })
  masculineSingular!: string;

  @prop({ required })
  masculinePlural!: string;

  @prop({ required })
  feminineSingular!: string;

  @prop({ required })
  femininePlural!: string;
}

export { AdjectiveSchema };
