import { Verb, VerbForms } from "@shared/language";
import { prop } from "@typegoose/typegoose";
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

  @prop({ type: VerbFormsSchema })
  irregularForms: VerbForms | undefined;
}

export { VerbSchema };
