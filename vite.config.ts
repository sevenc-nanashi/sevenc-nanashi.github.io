import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import uno from "unocss/vite";
import vueRouter from "unplugin-vue-router/vite";
import { fontSubsetter } from "rollup-plugin-font-subsetter";
import { imagetools } from "vite-imagetools";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => ["budoux-ja"].includes(tag),
        },
      },
    }),
    vueRouter(),
    uno(),
    imagetools(),
    fontSubsetter(),
  ],
  server: {
    allowedHosts: true,
  },
  build: {
    target: "es2022",
    // lightningcssだと@propertyで警告が出まくるのでesbuildに変更
    cssMinify: "esbuild",
  },
});
