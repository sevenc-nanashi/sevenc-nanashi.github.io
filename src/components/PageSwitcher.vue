<script setup lang="ts">
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();
type Section = {
  path: string;
  name: string;
  icon: string;
};
const sections: Section[] = [
  {
    path: "/",
    name: "About Me",
    icon: "i-fluent:person-24-regular",
  },
  {
    path: "/works",
    name: "Works",
    icon: "i-fluent:apps-24-regular",
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
        un-flex
        un-items="center"
      >
        <div
          :class="section.icon"
          un-text="xl"
          un-inline-block
          un-hidden="md:~"
        />
        <span un-hidden un-inline="md:~">
          {{ section.name }}
        </span>
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
