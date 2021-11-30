import { connect } from "mongoose";
import { createModels } from "./models";

const createConnection = async (
  database: string,
  host: string,
  port: number
) => {
  const models = createModels();
  const connection = await connect(`mongodb://${host}:${port}`, {
    dbName: database,
  });

  return { models, connection };
};

export { createConnection };
