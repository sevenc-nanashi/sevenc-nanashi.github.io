<script setup lang="ts">
import { RouterLink, useRoute } from "vue-router";

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
    <template v-for="(section, index) in sections" :key="index">
      <RouterLink
        :to="section.path"
        un-text="lg"
        :class="{
          selected: route.path === section.path,
        }"
      >
        {{ section.name }}
      </RouterLink>
      <span v-if="index < sections.length - 1" un-text="lg slate">|</span>
    </template>
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
    filter: drop-shadow(0 0 4px #fff7);
  }
}
</style>
