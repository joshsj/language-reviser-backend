import { Base } from "@typegoose/typegoose/lib/defaultClasses";

type ClientId = string;

type Entity<T extends {} = {}> = Pick<Base, "_id"> & T;

type ActiveChallenge = Entity & {
  answer: string;
  clientId: ClientId | undefined;
};

export { Entity, ActiveChallenge, ClientId };
