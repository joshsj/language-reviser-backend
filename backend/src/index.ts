import { createContainer } from "@/common/dependency/container";
import { answerChecker } from "@/common/game";
import { Dependencies } from "./dependency";
import { createModels } from "./data/models";
import { createDatabase } from "./data";
import { createServer } from "./server";
import { getEnv } from "./env";
import { logger } from "./server/logging";
import { createHandlers } from "./logic/message-handlers";

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

  createServer(env.socketPort, container).start();
};

main();
