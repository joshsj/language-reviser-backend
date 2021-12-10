import { Container } from "@/common/dependency/container";
import { connect } from "mongoose";
import { Dependencies } from "../dependency";

const createDatabase = async (
  database: string,
  host: string,
  port: number
) => ({
  connection: await connect(`mongodb://${host}:${port}`, {
    dbName: database,
  }),

  /** Removes any stale data from previous uptime */
  clean: async (container: Container<Dependencies>) => {
    const activeChallenges = container.resolve("activeChallenges");

    if (!activeChallenges) {
      return;
    }

    container.resolve("logger")?.(`Deleting stale activeChallenges`);
    await activeChallenges.deleteMany({});
  },
});

export { createDatabase };
