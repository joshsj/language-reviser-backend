import { Challenge, ChallengeCategory, Attempt } from "./game";

type Message<TName, TBody> = TBody extends undefined
  ? { name: TName }
  : { name: TName; body: TBody };

type MapMessages<T extends { [key: string]: {} | undefined }> = {
  [K in keyof T]: Message<K, T[K]>;
};

type ClientMessages = MapMessages<{
  newChallenge: {
    categories: ChallengeCategory[];
  };

  attempt: Attempt;

  accents: undefined;
}>;

type ServerMessages = MapMessages<{
  newChallenge: Challenge;

  attempt: { result: boolean };

  accents: Record<string, string[]>;
}>;

type ClientMessage = keyof ClientMessages;
type ServerMessage = keyof ServerMessages;

export { ClientMessage, ClientMessages, ServerMessage, ServerMessages };
