<script setup lang="ts" generic="T extends string">
import { works, type WorkCategory } from "../works";
import GlassCard from "../components/GlassCard.vue";
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import WorkDisplay from "../components/WorkDisplay.vue";

const route = useRoute();

const icons: Record<WorkCategory, string> = {
  music: "i-fluent:music-note-2-24-regular",
  app: "i-fluent:app-generic-24-regular",
  art: "i-fluent:paint-brush-24-regular",
  other: "i-fluent:star-24-regular",
};

const currentWorkId = ref("");
const workSections = ref<HTMLElement[]>([]);
const intersectionRatios = new Map<string, number>();
let observer: IntersectionObserver | null = null;

if (route.hash) {
  currentWorkId.value = route.hash.slice(1);
}

onMounted(async () => {
  await nextTick();

  observer = new IntersectionObserver(
    (entries) => {
      let updated = false;
      for (const entry of entries) {
        const id = (entry.target as HTMLElement).dataset.workId;
        if (!id) {
          continue;
        }
        intersectionRatios.set(
          id,
          entry.isIntersecting ? entry.intersectionRatio : 0,
        );
        updated = true;
      }

      if (!updated) {
        return;
      }

      let topId = "";
      let topRatio = 0;
      for (const [id, ratio] of intersectionRatios) {
        if (ratio > topRatio) {
          topRatio = ratio;
          topId = id;
        }
      }

      if (topRatio > 0 && topId && topId !== currentWorkId.value) {
        currentWorkId.value = topId;
      }
    },
    {
      threshold: [0, 0.25, 0.5, 0.75, 1],
    },
  );

  for (const section of workSections.value) {
    observer.observe(section);
  }
});

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
});
</script>
<template>
  <section
    class="works-section"
    un-flex-grow
    un-w="full"
    un-max-w="4xl"
    un-mx="auto"
    un-p="4"
  >
    <aside un-w="64" un-flex="~ col" un-gap="4" un-sticky un-top="8">
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
          :color="work.id === currentWorkId ? 'theme' : 'themeSecondary'"
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
      <section
        v-for="(work, index) in works"
        :key="work.id"
        :id="work.id"
        :data-work-id="work.id"
        ref="workSections"
        un-mb="8"
      >
        <WorkDisplay :work="work" />
      </section>
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
