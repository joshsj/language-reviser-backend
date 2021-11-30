type Challenge = {
  challengeId: string;
  answerLength: number;
  hint?: string;
  pre?: string;
  post?: string;
};

type Attempt = { challengeId: string; attempt: string };

type VerbOptions = { regular: boolean; irregular: boolean };

type NounOptions = {};

type ChallengeOptions = {
  verb?: VerbOptions;
  noun?: NounOptions;
};

export { Challenge, Attempt, VerbOptions, NounOptions, ChallengeOptions };
