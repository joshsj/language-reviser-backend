import { createApp } from "vue";
import { App } from "./App";
import { createConnection } from "./server";

const main = async () => {
  const server = await createConnection(import.meta.env.VITE_SERVER_URL);

  createApp(App, { server }).mount("#app");
};

main();
