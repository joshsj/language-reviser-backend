import { random } from "@/common/utilities";

const getAnswerLength = (answer: string) => Math.round(answer.length + 1 + random(1));

export { getAnswerLength };
