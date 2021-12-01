import { connect } from "mongoose";

const createDatabase = (database: string, host: string, port: number) =>
  connect(`mongodb://${host}:${port}`, {
    dbName: database,
  });

export { createDatabase };
