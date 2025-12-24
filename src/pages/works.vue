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
  lib: "i-fluent:library-24-regular",
  other: "i-fluent:star-24-regular",
};

const currentWorkId = ref("");
const isSidebarOpen = ref(false);
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
    :class="{ 'is-open': isSidebarOpen }"
    un-flex-grow
    un-w="full"
    un-max-w="6xl"
    un-mx="auto"
    un-p="4 b-0"
  >
    <aside
      id="works-sidebar"
      un-min-w="64"
      un-m="lg:t--8"
      un-p="2"
      un-flex="~ col"
      un-gap="4"
      un-sticky
      un-top="8"
      un-h="lg:[calc(100vh_-_8rem)]"
      un-overflow-y="auto"
    >
      <RouterLink
        v-for="work in works"
        :key="work.id"
        :to="`/works#${work.id}`"
        @click="isSidebarOpen = false"
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
          <div
            un-text="xl"
            un-aspect="square"
            :class="icons[work.category]"
            aria-hidden="true"
          />
          <h3 un-text="lg right" un-ml="2" un-flex-grow>
            <budoux-ja>
              <template v-for="line in work.title.split('\n')" :key="line">
                {{ line }}<br />
              </template>
            </budoux-ja>
          </h3>
        </GlassCard>
      </RouterLink>
    </aside>
    <div class="works-content">
      <div class="sidebar-backdrop" @click="isSidebarOpen = false" />
      <section
        v-for="work in works"
        :key="work.id"
        :id="work.id"
        :data-work-id="work.id"
        ref="workSections"
      >
        <WorkDisplay :work="work" />
      </section>
    </div>
    <div un-h="0" un-sticky un-bottom="22">
      <button
        type="button"
        un-absolute
        un-bottom="0"
        un-hidden="lg:~"
        :aria-expanded="isSidebarOpen"
        aria-controls="works-sidebar"
        :aria-label="isSidebarOpen ? 'Close works sidebar' : 'Open works sidebar'"
        @click="isSidebarOpen = !isSidebarOpen"
      >
        <GlassCard clickable color="theme" un-p="2" un-flex un-items="center" un-justify="center">
          <div un-text="2xl" class="i-fluent:apps-24-regular" aria-hidden="true" />
        </GlassCard>
      </button>
    </div>
  </section>
</template>

<style scoped>
.works-section {
  display: grid;
  grid-template-columns: auto 1fr 0;
  gap: calc(var(--spacing) * 4);

  align-items: start;
}

.works-content {
  display: flex;
  flex-direction: column;
  gap: calc(var(--spacing) * 4);
}

.sidebar-toggle {
  display: none;
  align-items: center;
  gap: calc(var(--spacing) * 2);
  border: none;
  background: transparent;
  padding: 0;
  color: inherit;
  cursor: pointer;
}

.sidebar-backdrop {
  display: none;
}

@screen lt-lg {
  .works-section {
    grid-template-columns: 1fr;
    position: relative;
  }

  .works-section > aside {
    position: fixed;
    top: calc(var(--spacing) * 4);
    left: calc(var(--spacing) * 4);
    bottom: calc(var(--spacing) * 4);
    width: min(80vw, 18rem);
    padding: calc(var(--spacing) * 3);
    overflow-y: auto;
    border-radius: calc(var(--spacing) * 3);
    transform: translateX(calc(-100% - (var(--spacing) * 2)));
    transition: transform 0.2s ease;
    z-index: 30;
    background: light-dark(rgba(255, 255, 255, 0.08), rgba(6, 12, 18, 0.72));
    backdrop-filter: blur(10px);
  }

  .works-section.is-open > aside {
    transform: translateX(0);
  }

  .sidebar-toggle {
    display: inline-flex;
    margin-bottom: calc(var(--spacing) * 4);
  }

  .sidebar-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: light-dark(#fff8, #0008);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
    z-index: 20;
  }

  .works-section.is-open .sidebar-backdrop {
    opacity: 1;
    pointer-events: auto;
  }
}
</style>
