type Challenge = {
  challengeId: string;
  answerLength: number;
  hint?: string;
  pre?: string;
  post?: string;
};

type ChallengeCategory = "verb";

type Attempt = { challengeId: string; attempt: string };

export { Challenge, ChallengeCategory, Attempt };
