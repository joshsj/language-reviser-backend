import { red, green } from "picocolors";
import { createServer } from "./connection";
import { Logger } from "../../shared/utilities";
import { Presentation } from "../../shared/message";

const port = parseInt(process.env.port!);

const handlers: Presentation = {
  newChallenge: () => ({ name: "newChallenge", answer: "test" }),
};

const logColor = {
  good: green,
  bad: red,
  info: (s: string) => s,
};

const log: Logger = (s, mode = "info") => console.log(logColor[mode](s));

createServer(port, handlers, log);
