<script setup lang="ts">
import { RouterLink, useRoute } from "vue-router";
import GlassCard from "./GlassCard.vue";

const route = useRoute();
type Section = {
  path: string;
  name: string;
};
const sections: Section[] = [
  {
    path: "/",
    name: "About Me",
  },
  {
    path: "/works",
    name: "Works",
  },
];
</script>
<template>
  <nav id="page-switcher" un-flex un-items="center" un-gap="4">
    <RouterLink
      v-for="(section, key) in sections"
      :key="key"
      :to="section.path"
      un-text="lg"
      :class="{
        selected:
          section.path === '/'
            ? route.path === section.path
            : route.path.startsWith(section.path),
      }"
    >
      {{ section.name }}
    </RouterLink>
  </nav>
</template>

<style scoped>
#page-switcher > a {
  background: transparent;
  cursor: pointer;
  text-decoration: none;

  color: theme("colors.text");
  &.selected {
    color: theme("colors.theme.500");
  }
}
</style>
