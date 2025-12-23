import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import uno from "unocss/vite";
import vueRouter from "unplugin-vue-router/vite";
import { fontSubsetter } from "rollup-plugin-font-subsetter";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueRouter(), uno(), fontSubsetter()],
  server: {
    allowedHosts: true,
  },
  build: {
    target: "es2022",
  },
});
