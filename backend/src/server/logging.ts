import { Logger } from "@/common/dependency";
import { red, green } from "picocolors";

const logColor = {
  good: green,
  bad: red,
  info: (s: string) => s,
};

const logger: Logger = (s, mode = "info") => console.log(logColor[mode](s));

export { logger };
