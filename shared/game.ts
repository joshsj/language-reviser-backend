type Challenge = {
  hint?: string;
  pre?: string;
  post?: string;
};

type ChallengeCategory = "verb";

type Attempt = { attempt: string; actual: string };

const validateAttempt = ({ attempt, actual }: Attempt): boolean =>
  attempt.localeCompare(actual, undefined, { sensitivity: "accent" }) === 0;

export { Challenge, ChallengeCategory, Attempt, validateAttempt };
