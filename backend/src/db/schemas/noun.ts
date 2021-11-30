import { Noun, Gender } from "@shared/language";
import { prop } from "@typegoose/typegoose";
import { WordSchema } from "./word";

const required = true;

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

export { NounSchema };
