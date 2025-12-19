<script setup lang="ts" generic="T extends string">
import { works, type Work, type WorkCategory } from "../works";
import GlassCard from "../components/GlassCard.vue";
import { computed, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import WorkDisplay from "../components/WorkDisplay.vue";

const route = useRoute();

const icons: Record<WorkCategory, string> = {
  music: "i-fluent:music-note-2-24-regular",
  app: "i-fluent:app-generic-24-regular",
  art: "i-fluent:paint-brush-24-regular",
  other: "i-fluent:star-24-regular",
};
</script>
<template>
  <section
    class="works-section"
    un-flex-grow
    un-w="full"
    un-max-w="screen-2xl"
    un-mx="auto"
    un-p="4"
  >
    <aside un-w="64" un-flex="~ col" un-gap="4" un-sticky un-top="2">
      <RouterLink
        v-for="(work, index) in works"
        :key="work.id"
        :to="`/works#${work.id}`"
        un-w="full"
        un-cursor="pointer"
        un-color="inherit"
        un-decoration="none"
      >
        <GlassCard
          clickable
          color="themeSecondary"
          class="work-card"
          un-p="x-4 y-2"
          un-w="full"
          un-flex
          un-items="center"
        >
          <div un-text="xl" :class="icons[work.category]" />
          <div un-flex-grow />
          <h3 un-text="lg">{{ work.title }}</h3>
        </GlassCard>
      </RouterLink>
    </aside>
    <div>
      <WorkDisplay
        v-for="(work, index) in works"
        :key="work.id"
        :work="work"
        :id="work.id"
        un-mb="8"
      />
    </div>
  </section>
</template>

<style scoped>
.works-section {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: calc(var(--spacing) * 4);

  align-items: start;
}
</style>
