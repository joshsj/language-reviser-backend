import { createContainer } from "@/common/dependency/container";
import { createApp } from "vue";
import { App } from "./App";
import { Dependencies } from "./dependency";
import { createMessenger } from "../../common/messenger";

const main = async () => {
  const container = createContainer<Dependencies>({});

  import.meta.env.DEV && container.provide("logger", (s) => console.log(s));

  container.provide(
    "messenger",
    await createMessenger(import.meta.env.VITE_SERVER_URL, container)
  );

  createApp(App, { container }).mount("#app");
};

main();
