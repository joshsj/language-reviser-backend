import { createContainer } from "@/common/dependency/container";
import { answerChecker } from "@/common/game";
import { createDatabase } from "./data";
import { migrate } from "./data/migrations";
import { createModels } from "./data/models";
import { Dependencies } from "./dependency";
import { getEnv } from "./env";
import { createHandlers } from "./logic/message-handlers";
import { createServer } from "./server";
import { logger } from "./server/logging";

const main = async () => {
  const env = getEnv();
  const container = createContainer<Dependencies>({}, "multiProvide");
  const models = createModels();

  container
    .provide("logger", logger)
    .provide("answerChecker", answerChecker)
    .provide("words", models.words)
    .provide("activeChallenges", models.activeChallenges)
    .provide("messageHandlers", createHandlers(container));

  await createDatabase(env.mongoDatabase, env.mongoHost, env.mongoPort);

  await migrate(container);

  createServer(env.socketPort, container).start();
};

main();
