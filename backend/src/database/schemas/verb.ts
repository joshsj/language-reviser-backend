import { prop } from "@typegoose/typegoose";
import { Verb, VerbForms } from "../types";
import { WordSchema } from "./word";

const required = true;

class VerbFormsSchema implements VerbForms {
  @prop({ required })
  je!: string;

  @prop({ required })
  tu!: string;

  @prop({ required })
  il!: string;

  @prop({ required })
  nous!: string;

  @prop({ required })
  vous!: string;

  @prop({ required })
  ils!: string;
}

class VerbSchema extends WordSchema<"verb"> implements Verb {
  @prop({ required })
  infinitive!: string;

  @prop({ required })
  regular!: boolean;

  @prop({ type: VerbFormsSchema })
  forms!: VerbForms;
}

export { VerbSchema };
