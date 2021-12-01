import { defineConfig, searchForWorkspaceRoot } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
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
});
