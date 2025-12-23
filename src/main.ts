import "@fontsource/zen-kaku-gothic-new/index.css";
import { handleHotUpdate, routes } from "vue-router/auto-routes";
import { ViteSSG } from "vite-ssg";
import "./style.scss";
import "virtual:uno.css";
import App from "./App.vue";

let isFirstHashScroll = true;
const baseTitle = "Nanashi.";
const routeTitles: Record<string, string> = {
  "/": baseTitle,
  "/works": `Works | ${baseTitle}`,
};

export const createApp = ViteSSG(
  App,
  {
    routes,
    scrollBehavior(to, _from, savedPosition) {
      if (savedPosition) return savedPosition;

      if (to.hash) {
        const behavior = isFirstHashScroll ? "auto" : "smooth";
        isFirstHashScroll = false;

        return {
          el: to.hash,
          top: 10,
          behavior,
        };
      }

      return { left: 0, top: 0 };
    },
  },
  ({ router }) => {
    if (!import.meta.env.SSR) {
      // exports欄にbudoux-jaのwebcomponentsがないので直接importする
      void import("../node_modules/budoux/module/webcomponents/budoux-ja.js");

      router.afterEach((to) => {
        document.title = routeTitles[to.path] ?? baseTitle;
      });

      if (import.meta.hot) {
        handleHotUpdate(router);
      }
    }
  },
);
