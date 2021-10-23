import { createApp } from "vue";
import { App } from "./App";
import { createConnection } from "./connection";

// TODO: parse url from .env

const url = "ws://localhost:5500";

createConnection(url).then((connection) =>
  createApp(App, { connection }).mount("#app")
);
