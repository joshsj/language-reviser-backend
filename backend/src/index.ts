import { createContainer } from "./dependency/container";
import { Dependencies } from "./dependency";
import { createModels } from "./data/models";
import { createDatabase } from "./data";
import { createServer } from "./server";
import { createHandlers } from "./domain/handlers";
import { log } from "./domain/logging";
import { getEnv } from "./env";

const main = async () => {
  const env = getEnv();

  const models = createModels();

  const container = createContainer<Dependencies>({});

  container
    .provide("words", models.words)
    .provide("activeChallenges", models.activeChallenges)
    .provide("messageHandlers", createHandlers(container))
    .provide("logger", log);

  await createDatabase(env.mongoDatabase, env.mongoHost, env.mongoPort);

  createServer(env.socketPort, container).start();
};

main();
