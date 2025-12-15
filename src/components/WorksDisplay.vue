<script setup lang="ts" generic="T extends string">
import type { Display } from "../works.ts";

const props = defineProps<{
  display: Display;
}>();
</script>
<template>
  <div class="work-display">
    <div un-aspect="16/9">
      <iframe
        v-if="display.source === 'niconico'"
        :src="`https://embed.nicovideo.jp/watch/${display.id}`"
        width="100%"
        height="100%"
        frameborder="0"
        allowfullscreen
        allow="autoplay; encrypted-media; picture-in-picture"
      />
    </div>
  </div>
</template>
