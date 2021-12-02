import { prop } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { Entity as _Entity } from "../entities";

class Entity implements _Entity {
  @prop()
  _id!: Types.ObjectId;
}

export { Entity };
