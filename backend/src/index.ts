import * as server from "./server/host";
import * as db from "./db/connection";
import { getEnv, log } from "./utilities";
import { createHandlers } from "./server/handlers";

const main = async () => {
  const env = getEnv();

  const { models } = await db.createConnection(
    env.mongoDatabase,
    env.mongoHost,
    env.mongoPort
  );

  const handlers = createHandlers(models);

  server.createServer().start(env.socketPort, handlers, log);
};

main();
