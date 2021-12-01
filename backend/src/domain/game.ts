const checkAttempt = (attempt: string, answer: string): boolean =>
  attempt.localeCompare(answer, undefined, { sensitivity: "accent" }) === 0;

export { checkAttempt };
