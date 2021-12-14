type Env = {
  socketHost: string;
  socketPort: number;
  mongoDatabase: string;
  mongoHost: string;
  mongoPort: number;
};

type EnvFile = { [K in keyof Env]: string };

const getEnv = (): Env => {
  const { socketHost, socketPort, mongoDatabase, mongoHost, mongoPort } = process.env as EnvFile;

  return {
    socketHost,
    socketPort: parseInt(socketPort),
    mongoDatabase,
    mongoHost,
    mongoPort: parseInt(mongoPort),
  };
};

export { getEnv, Env };
