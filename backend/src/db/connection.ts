import { connect } from "mongoose";
import { createModels } from "./models";

const createConnection = async (
  database: string,
  host: string,
  port: number
) => {
  const words = createModels();
  const connection = await connect(`mongodb://${host}:${port}`, {
    dbName: database,
  });

  return { words, connection };
};

export { createConnection };
