import { Logger } from "@shared/dependency";
import { red, green } from "picocolors";

type Env = {
  socketPort: number;
  mongoDatabase: string;
  mongoHost: string;
  mongoPort: number;
};

type EnvFile = { [K in keyof Env]: string };

const getEnv = (): Env => {
  const { socketPort, mongoDatabase, mongoHost, mongoPort } =
    process.env as EnvFile;

  return {
    socketPort: parseInt(socketPort),
    mongoDatabase,
    mongoHost,
    mongoPort: parseInt(mongoPort),
  };
};

const logColor = {
  good: green,
  bad: red,
  info: (s: string) => s,
};

const log: Logger = (s, mode = "info") => console.log(logColor[mode](s));

export { Env, getEnv, log };
