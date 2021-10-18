type Challenge = {
  answer: string;
  hint?: string;
  pre?: string;
  post?: string;
};

type ChallengeCategory = "verb";

type Attempt = { attempt: string; actual: string };
type Result = "correct" | "skip" | "incorrect";

const validateAttempt = ({ attempt, actual }: Attempt): Result => {
  if (!attempt.localeCompare("skip", undefined, { sensitivity: "base" })) {
    return "skip";
  }

  if (!attempt.localeCompare(actual, undefined, { sensitivity: "accent" })) {
    return "correct";
  }

  return "incorrect";
};

export { Challenge, ChallengeCategory, Attempt, Result, validateAttempt };
