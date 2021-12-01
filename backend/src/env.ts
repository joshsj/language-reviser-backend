import { Env } from "./dependency";

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

export { getEnv, Env };
