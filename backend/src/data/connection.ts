import { connect } from "mongoose";

const createConnection = (database: string, host: string, port: number) =>
  connect(`mongodb://${host}:${port}`, { dbName: database });

export { createConnection };
