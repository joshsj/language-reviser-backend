import { defineConfig, searchForWorkspaceRoot, UserConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from "path";

export default defineConfig(({ mode }) => {
  const config: UserConfig =
    mode === "production"
      ? {
          base: "/language-revisor/",
          envDir: "../.github/",
        }
      : {};

  return {
    ...config,
    build: { outDir: "build" },
    plugins: [vue(), vueJsx()],
    resolve: {
      alias: {
        "@/common": path.resolve(__dirname, "../common"),
      },
    },
    server: {
      fs: {
        allow: [searchForWorkspaceRoot(process.cwd()), "../common"],
      },
    },
  };
});
