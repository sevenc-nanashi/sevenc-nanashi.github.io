<script setup lang="ts" generic="T extends string">
import { works, type Work, type WorkCategory } from "../works";
import GlassCard from "../components/GlassCard.vue";
import WorksDisplay from "../components/WorksDisplay.vue";

const work = works[0];

const icons: Record<WorkCategory, string> = {
  music: "i-fluent:music-note-2-24-regular",
  app: "i-fluent:app-generic-24-regular",
  art: "i-fluent:paint-brush-24-regular",
  other: "i-fluent:star-24-regular",
};
</script>
<template>
  <section class="works-section" un-flex-grow>
    <ul un-min-w="64">
      <li v-for="work in works" :key="work.id">
        <button>
          <GlassCard
            class="work-card"
            color="themeSecondary"
            un-p="x-4 y-2"
            un-flex
            un-items="center"
          >
            <h3 un-text="lg">{{ work.title }}</h3>
            <div un-flex="grow" />
            <div un-text="xl" :class="icons[work.category]" />
          </GlassCard>
        </button>
      </li>
    </ul>
    <article>
      <h2 un-text="2xl">{{ work.title }}</h2>
      <p>{{ work.description }}</p>
    </article>
    <WorksDisplay :display="work.display" />
  </section>
</template>

<style scoped>
.works-section {
  display: grid;
  grid-template:
    "selector description" 1fr
    "selector display" auto / auto 1fr;
  gap: calc(var(--spacing) * 4);

  align-items: center;

  & > *:nth-child(1) {
    grid-area: selector;
  }
  & > *:nth-child(2) {
    grid-area: description;
  }
  & > *:nth-child(3) {
    grid-area: display;
    width: 100%;
    height: 100%;
  }
}
</style>
