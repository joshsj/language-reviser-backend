import { createModels } from "./database/models";
import { createDatabase } from "./database";
import { createServer } from "./server";
import { createHandlers } from "./domain/handlers";
import { getEnv } from "./env";
import { log } from "./domain/logging";

const main = async () => {
  const env = getEnv();

  const models = createModels();
  const handlers = createHandlers(models);

  await createDatabase(env.mongoDatabase, env.mongoHost, env.mongoPort);

  createServer(env.socketPort, handlers, log).start();
};

main();
