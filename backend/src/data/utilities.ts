import { Types } from "mongoose";
import { ClientId } from "./entities";

const id = (id?: ClientId) => new Types.ObjectId(id);

export { id };
