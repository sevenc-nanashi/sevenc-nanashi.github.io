import { createApp } from "vue";
import "virtual:uno.css";
import "@fontsource/zen-kaku-gothic-new/index.css";
import "./style.scss";
import App from "./App.vue";
import { router } from "./router.ts";

createApp(App).use(router).mount("#app");
