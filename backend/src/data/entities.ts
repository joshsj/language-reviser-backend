import { Base } from "@typegoose/typegoose/lib/defaultClasses";

type Entity<T extends {} = {}> = Pick<Base, "_id"> & T;

type ActiveChallenge = Entity & { answer: string };

export { Entity, ActiveChallenge };
