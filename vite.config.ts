import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import uno from "unocss/vite";
import vueRouter from "unplugin-vue-router/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueRouter(), uno()],
  server: {
    allowedHosts: true,
  },
});
