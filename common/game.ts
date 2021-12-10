import { AnswerChecker } from "./dependency";

const answerChecker: AnswerChecker = (attempt: string, answer: string) => {
  const check = (sensitivity: "accent" | "base") => attempt.localeCompare(answer, undefined, { sensitivity });

  if (check("accent") === 0) {
    return "correct";
  }

  if (check("base") === 0) {
    return "close";
  }

  return "incorrect";
};

export { answerChecker };
