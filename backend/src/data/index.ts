import { Container } from "@/common/dependency/container";
import { connect } from "mongoose";
import { Dependencies } from "../dependency";

const createDatabase = async (database: string, host: string, port: number) => ({
  connection: await connect(`mongodb://${host}:${port}`, {
    dbName: database,
  }),

  /** Removes any stale data from previous uptime */
  clean: async (container: Container<Dependencies>) => {
    const log = container.resolve("logger");
    const models = container.resolve("models");

    if (!models) {
      log?.("Cannot clean the database, missing required dependency: models");
      return;
    }

    log?.(`Deleting stale activeChallenges`);
    await models.activeChallenges.deleteMany({});
  },
});

export { createDatabase };
