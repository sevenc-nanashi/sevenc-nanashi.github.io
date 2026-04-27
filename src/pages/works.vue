<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { works, type Tag, type Work, type WorkCategory } from "../works";
import GlassCard from "../components/GlassCard.vue";
import WorkDisplay from "../components/WorkDisplay.vue";

const route = useRoute();
const router = useRouter();

const baseCategoryOrder: WorkCategory[] = ["music", "app", "extension", "art", "lib", "other"];

const icons: Record<WorkCategory, string> = {
  music: "i-fluent:music-note-2-24-regular",
  app: "i-fluent:app-generic-24-regular",
  extension: "i-fluent:puzzle-piece-24-regular",
  art: "i-fluent:paint-brush-24-regular",
  lib: "i-fluent:library-24-regular",
  other: "i-fluent:star-24-regular",
};

const categoryLabels: Record<WorkCategory, string> = {
  music: "Music",
  app: "App",
  extension: "Extension",
  art: "Art",
  lib: "Library",
  other: "Other",
};

const currentWorkId = ref("");
const isSidebarOpen = ref(false);
const workSections = ref<HTMLElement[]>([]);
const intersectionRatios = new Map<string, number>();
let observer: IntersectionObserver | null = null;

const categoryCounts: Record<WorkCategory, number> = {
  music: 0,
  app: 0,
  extension: 0,
  art: 0,
  lib: 0,
  other: 0,
};
const tagCounts = new Map<Tag, number>();

for (const work of works) {
  categoryCounts[work.category] += 1;

  for (const tag of work.tags) {
    const currentCount = tagCounts.get(tag);
    tagCounts.set(tag, currentCount === undefined ? 1 : currentCount + 1);
  }
}

const categoryOrder = [...baseCategoryOrder].sort((a, b) => {
  const countDiff = categoryCounts[b] - categoryCounts[a];
  if (countDiff !== 0) {
    return countDiff;
  }
  return baseCategoryOrder.indexOf(a) - baseCategoryOrder.indexOf(b);
});

const allTags = [...tagCounts.keys()].sort((a, b) => {
  const aCount = tagCounts.get(a);
  const bCount = tagCounts.get(b);
  if (aCount === undefined || bCount === undefined) {
    throw new Error("Tag count is missing");
  }

  const countDiff = bCount - aCount;
  if (countDiff !== 0) {
    return countDiff;
  }
  return a.localeCompare(b, "en");
});

const getTagCount = (tag: Tag): number => {
  const count = tagCounts.get(tag);
  if (count === undefined) {
    throw new Error(`Tag count is missing: ${tag}`);
  }
  return count;
};

const isWorkCategory = (value: string): value is WorkCategory =>
  categoryOrder.includes(value as WorkCategory);

const getSelectedCategory = (): WorkCategory | undefined => {
  const rawCategory = route.query.category;
  if (typeof rawCategory !== "string") {
    return undefined;
  }
  if (!isWorkCategory(rawCategory)) {
    return undefined;
  }
  return rawCategory;
};

const getSelectedTags = (): Tag[] => {
  const rawTags = route.query.tag;
  const tags = Array.isArray(rawTags)
    ? rawTags.filter((tag): tag is string => typeof tag === "string")
    : typeof rawTags === "string"
      ? [rawTags]
      : [];
  return [...new Set(tags)].filter((tag) => allTags.includes(tag));
};

const selectedCategory = computed(() => getSelectedCategory());
const selectedTags = computed(() => getSelectedTags());

const matchesFilters = (
  work: Work,
  category: WorkCategory | undefined,
  tags: Tag[],
): boolean => {
  if (category !== undefined && work.category !== category) {
    return false;
  }
  if (tags.length > 0 && !tags.every((tag) => work.tags.includes(tag))) {
    return false;
  }
  return true;
};

const filteredWorks = computed(() =>
  works.filter((work) =>
    matchesFilters(work, selectedCategory.value, selectedTags.value),
  ),
);

const hasActiveFilters = computed(
  () => selectedCategory.value !== undefined || selectedTags.value.length > 0,
);

const updateFilters = async (
  category: WorkCategory | undefined,
  tags: Tag[],
) => {
  const query: Record<string, string | string[]> = {};
  if (category !== undefined) {
    query.category = category;
  }
  if (tags.length > 0) {
    query.tag = tags;
  }

  const hashWorkId = route.hash.startsWith("#") ? route.hash.slice(1) : "";
  const filteredByNextQuery = works.filter((work) => matchesFilters(work, category, tags));
  const nextHash = filteredByNextQuery.some((work) => work.id === hashWorkId)
    ? route.hash
    : "";

  await router.replace({
    path: route.path,
    query,
    hash: nextHash,
  });
};

const toggleCategory = async (category: WorkCategory) => {
  const nextCategory = selectedCategory.value === category ? undefined : category;
  await updateFilters(nextCategory, selectedTags.value);
};

const toggleTag = async (tag: Tag) => {
  const currentTags = new Set(selectedTags.value);
  if (currentTags.has(tag)) {
    currentTags.delete(tag);
  } else {
    currentTags.add(tag);
  }
  await updateFilters(selectedCategory.value, [...currentTags].sort((a, b) => a.localeCompare(b, "en")));
};

const clearFilters = async () => {
  await updateFilters(undefined, []);
};

const observeWorkSections = () => {
  observer?.disconnect();
  intersectionRatios.clear();

  if (observer === null) {
    return;
  }

  for (const section of workSections.value) {
    observer.observe(section);
  }
};

watch(
  () => route.hash,
  (hash) => {
    currentWorkId.value = hash.startsWith("#") ? hash.slice(1) : "";
  },
  { immediate: true },
);

watch(
  () => filteredWorks.value.map((work) => work.id),
  async (visibleWorkIds) => {
    await nextTick();
    observeWorkSections();

    if (visibleWorkIds.length === 0) {
      currentWorkId.value = "";
      return;
    }

    if (!visibleWorkIds.includes(currentWorkId.value)) {
      currentWorkId.value = visibleWorkIds[0];
    }
  },
  { immediate: true },
);

onMounted(async () => {
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
  await nextTick();
  observeWorkSections();
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
      un-w="96"
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
        v-for="work in filteredWorks"
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
          <div un-text="xl" un-aspect="square" :class="icons[work.category]" aria-hidden="true" />
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
      <GlassCard
        class="works-filter-card"
        color="themeSecondary"
        un-p="3"
        un-flex="~ col"
        un-gap="3"
      >
        <div un-flex="~" un-items="center" un-justify="between" un-gap="2">
          <h2 un-text="sm wide semibold">Filter</h2>
          <button v-if="hasActiveFilters" type="button" class="filter-reset" @click="clearFilters">
            Clear
          </button>
        </div>
        <div un-flex="~ wrap" un-gap="2">
          <button
            v-for="category in categoryOrder"
            :key="category"
            type="button"
            class="filter-chip"
            :class="{ active: selectedCategory === category }"
            @click="toggleCategory(category)"
          >
            <span :class="icons[category]" aria-hidden="true" />
            <span>{{ categoryLabels[category] }}</span>
            <span class="filter-chip-count">{{ categoryCounts[category] }}</span>
          </button>
        </div>
        <div un-flex="~ wrap" un-gap="2">
          <button
            v-for="tag in allTags"
            :key="tag"
            type="button"
            class="filter-chip tag-chip"
            :class="{ active: selectedTags.includes(tag) }"
            @click="toggleTag(tag)"
          >
            #{{ tag }}
            <span class="filter-chip-count">{{ getTagCount(tag) }}</span>
          </button>
        </div>
        <p un-text="xs slate-600 dark:slate-300">
          {{ filteredWorks.length }} / {{ works.length }} items
        </p>
      </GlassCard>
      <GlassCard v-if="filteredWorks.length === 0" color="themeSecondary" un-p="6" un-text="center">
        条件に一致する作品がありません。
      </GlassCard>
      <section
        v-for="work in filteredWorks"
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

.works-filter-card {
  overflow: hidden;
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

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: calc(var(--spacing) * 1.5);
  border: 1px solid light-dark(rgba(15, 23, 42, 0.12), rgba(226, 232, 240, 0.12));
  background: light-dark(rgba(255, 255, 255, 0.55), rgba(15, 23, 42, 0.32));
  color: inherit;
  border-radius: 999px;
  padding: calc(var(--spacing) * 1.5) calc(var(--spacing) * 2.5);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.filter-chip:hover {
  transform: translateY(-1px);
  border-color: light-dark(rgba(14, 165, 233, 0.32), rgba(125, 211, 252, 0.4));
}

.filter-chip.active {
  background: light-dark(rgba(14, 165, 233, 0.16), rgba(56, 189, 248, 0.2));
  border-color: light-dark(rgba(14, 165, 233, 0.45), rgba(125, 211, 252, 0.55));
}

.tag-chip {
  font-size: 0.85rem;
}

.filter-chip-count {
  border-radius: 999px;
  background: light-dark(rgba(15, 23, 42, 0.08), rgba(226, 232, 240, 0.14));
  padding: 0 calc(var(--spacing) * 1.5);
  font-size: 0.75rem;
  line-height: 1.4;
}

.filter-reset {
  border: none;
  background: transparent;
  color: light-dark(rgb(8 145 178), rgb(103 232 249));
  cursor: pointer;
  font: inherit;
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
