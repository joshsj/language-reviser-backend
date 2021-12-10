import { defineConfig, searchForWorkspaceRoot } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from "path";

export default defineConfig(({ command }) => ({
  base:
    command === "build"
      ? "/language-revisor/" // base path when deployed on github pages
      : undefined,

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
}));
