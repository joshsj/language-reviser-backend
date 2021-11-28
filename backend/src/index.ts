import { red, green } from "picocolors";

import * as server from "./server";
import * as db from "./data/connection";
import { getEnv } from "./utilities";

import { validateAttempt } from "@shared/game";
import { Logger } from "@shared/dependency";

// TODO: replace with actual implementation
const testHandlers: server.Handlers = {
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

const main = async () => {
  const env = getEnv();

  await db.createConnection(env.mongoDatabase, env.mongoHost, env.mongoPort);

  server.createServer().start(env.socketPort, testHandlers, log);
};

main();
