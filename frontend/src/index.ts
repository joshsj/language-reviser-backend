import { createContainer } from "@/common/dependency/container";
import { createApp } from "vue";
import { App } from "./App";
import { Dependencies } from "./dependency";
import { createMessenger } from "../../common/messenger";

const main = async () => {
  const container = createContainer<Dependencies>({});

  import.meta.env.DEV && container.provide("logger", (s) => console.log(s));

  const { VITE_SERVER_HOST: host, VITE_SERVER_PORT: port } = import.meta.env;

  container.provide("messenger", await createMessenger(host, parseInt(port), container));

  createApp(App, { container }).mount("#app");
};

main();
