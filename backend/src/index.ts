import { red, green } from "picocolors";
import { createServer, Handlers } from "./connection";
import { Logger } from "@shared/utilities";
import { validateAttempt } from "@shared/game";

const port = parseInt(process.env.port!);

const handlers: Handlers = {
  newChallenge: () => ({ name: "newChallenge", answer: "test" }),
  attempt: (a) => ({ name: "attempt", result: validateAttempt(a) }),
};

const logColor = {
  good: green,
  bad: red,
  info: (s: string) => s,
};

const log: Logger = (s, mode = "info") => console.log(logColor[mode](s));

createServer(port, handlers, log);
