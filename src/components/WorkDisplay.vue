<script setup lang="ts" generic="T extends string">
import { type Work } from "../works";
import GlassCard from "./GlassCard.vue";
import WorkLink from "./WorkLink.vue";

const props = defineProps<{
  work: Work;
}>();
</script>
<template>
  <GlassCard color="themeSecondary">
    <h2 un-text="2xl" un-mb="2">{{ props.work.title }}</h2>
    <div un-flex="~ wrap" un-items="center" un-gap="2" un-mb="2">
      <WorkLink
        v-for="(link, key) in props.work.links"
        :key="key"
        :link="link"
      />
    </div>
    <hr un-mb="2" un-text="theme-100" />
    <p>{{ props.work.description }}</p>
    <div class="work-display">
      <div v-if="!props.work.display" un-aspect="16/9" un-relative>
        <div
          un-relative
          un-aspect="16/9"
          un-w="full"
          un-bg="slate-100"
          un-grid
          un-justify="center"
          un-items="center"
          un-text="xl slate-400"
        >
          No Preview
        </div>
      </div>
      <div v-else un-aspect="16/9" un-relative>
        <div
          un-absolute
          un-aspect="16/9"
          un-w="full"
          un-bg="slate-100"
          un-animate="pulse"
          un-opacity="20%"
          un-grid
          un-justify="center"
          un-items="center"
          un-text="xl slate-400"
        >
          Loading...
        </div>

        <iframe
          v-if="props.work.display.source === 'niconico'"
          :src="`https://embed.nicovideo.jp/watch/${props.work.display.id}`"
          width="100%"
          height="100%"
          frameborder="0"
          allowfullscreen
          allow="autoplay; encrypted-media; picture-in-picture"
          un-relative
        />
      </div>
    </div>
  </GlassCard>
</template>

<style scoped></style>
