import { createRouter, createWebHistory } from "vue-router";
import { handleHotUpdate, routes } from "vue-router/auto-routes";

let isFirstHashScroll = true;

export const router = createRouter({
  history: createWebHistory(),
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
});

if (import.meta.hot) {
  handleHotUpdate(router);
}
