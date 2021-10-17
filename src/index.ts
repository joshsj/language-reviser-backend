import { createServer, Handlers } from "./connection";
import { Logger } from "./utilities";
import { red, green } from "picocolors";

const port = parseInt(process.env.port!);

const handlers: Handlers = {
  newChallenge: () => ({ name: "newChallenge", answer: "test" }),
};

const logColor = {
  good: green,
  bad: red,
  info: (s: string) => s,
};

const log: Logger = (s, mode = "info") => console.log(logColor[mode](s));

createServer(port, handlers, log);
