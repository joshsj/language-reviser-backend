import { createApp } from "vue";
import { App } from "./App";
import { createConnection } from "./server";

const main = async () => {
  const url = `ws://${import.meta.env.VITE_SERVER_URL}`;

  const server = await createConnection(url);

  createApp(App, { server }).mount("#app");
};

main();
