<script setup lang="ts">
import { ref } from "vue";
import GlassCard from "./components/GlassCard.vue";
import WorksSection from "./components/WorksSection.vue";
import BottomSwitcher from "./components/BottomSwitcher.vue";

const sections = {
  works: "Works",
  about: "About Me",
};
const selectdSection = ref<keyof typeof sections>("works");
</script>

<template>
  <div un-p="4" un-h="full" class="main">
    <GlassCard
      color="theme"
      un-p="x-2 y-4"
      un-text="xl"
      un-flex
      un-items="center"
    >
      <div un-bg="white" un-w="8" un-mr="2" un-text-center un-aspect-square>
        I
      </div>
      名無し。/ Nanashi.</GlassCard
    >
    <WorksSection />
    <BottomSwitcher v-model="selectdSection" :sections="sections" />
  </div>
</template>

<style scoped>
.main {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: calc(var(--spacing) * 4);
}
</style>
