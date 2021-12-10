import { createContainer } from "@/common/dependency/container";
import { answerChecker } from "@/common/game";
import { createDatabase } from "./data";
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

  const database = await createDatabase(
    env.mongoDatabase,
    env.mongoHost,
    env.mongoPort
  );

  await database.clean(container);

  createServer(env.socketPort, container);
};

main();
