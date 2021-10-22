import { red, green } from "picocolors";
import { validateAttempt } from "@shared/game";
import { Logger } from "@shared/dependency";
import { Handlers, startServer } from "./server";

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

startServer(port, handlers, log);
