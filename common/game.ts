import { AnswerChecker } from "./dependency";

const answerChecker: AnswerChecker = (
  attempt: string,
  answer: string
): boolean =>
  attempt.localeCompare(answer, undefined, { sensitivity: "accent" }) === 0;

export { answerChecker };
