import { red, green } from "picocolors";
import { validateAttempt } from "@shared/game";
import { Logger } from "@shared/dependency";
import { Handlers, startServer } from "./server";

const port = parseInt(process.env.port!);

// TODO: replace with actual implementation
const testHandlers: Handlers = {
  newChallenge: () => ({
    name: "newChallenge",
    body: {
      answer: "suis",
      hint: "être",
      pre: "je",
      post: "fatigué",
    },
  }),
  attempt: ({ body }) => ({
    name: "attempt",
    body: { result: validateAttempt(body) },
  }),
  accents: () => ({
    name: "accents",
    body: {
      a: ["à", "â"],
      e: ["é", "ê", "è", "ë"],
      i: ["î", "ï"],
      o: ["ô"],
      u: ["ù", "û", "ü"],
    },
  }),
};

const logColor = {
  good: green,
  bad: red,
  info: (s: string) => s,
};

const log: Logger = (s, mode = "info") => console.log(logColor[mode](s));

startServer(port, testHandlers, log);
