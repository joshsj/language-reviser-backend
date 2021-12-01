type Challenge = {
  challengeId: string;
  answerLength: number;
  hint?: string;
  pre?: string;
  post?: string;
  context?: string;
};

type Attempt = { challengeId: string; attempt: string };

type VerbOptions = { regular: boolean; irregular: boolean };
type NounOptions = {};

type ChallengeOptions = {
  verb?: VerbOptions;
  noun?: NounOptions;
};

type ClientMessage =
  | {
      name: "newChallenge";
      body: ChallengeOptions;
    }
  | { name: "attempt"; body: Attempt };

type ServerMessage =
  | { name: "newChallenge"; body: Challenge }
  | { name: "attempt"; body: { result: boolean } };

type ClientMessageName = ClientMessage["name"];
type ServerMessageName = ServerMessage["name"];

export {
  ClientMessage,
  ServerMessage,
  ClientMessageName,
  ServerMessageName,
  Challenge,
  Attempt,
  VerbOptions,
  NounOptions,
  ChallengeOptions,
};
