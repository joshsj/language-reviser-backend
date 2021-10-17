type ChallengeCategory = "verb";

type Challenge = {
  answer: string;
  hint?: string;
  pre?: string;
  post?: string;
};

export { Challenge, ChallengeCategory };
