<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    color?: "neutral" | "theme" | "themeSecondary";
  }>(),
  {
    color: "neutral",
  },
);

const colorClass = computed(() => {
  switch (props.color) {
    case "theme":
      return "bg-theme-500/20 shadow-theme-200/50";
    case "themeSecondary":
      return "bg-theme-100/20 shadow-theme-200/25";
    default:
      return "bg-white/20 shadow-theme-200/25";
  }
});
</script>
<template>
  <div
    class="glass-card"
    :class="colorClass"
    un-rounded="md"
    un-p="x-3 y-2"
    un-backdrop="blur-sm"
    un-shadow="sm"
  >
    <slot />
  </div>
</template>
