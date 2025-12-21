<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    color?: "neutral" | "theme" | "themeSecondary";
    clickable?: boolean;
  }>(),
  {
    color: "neutral",
    clickable: false,
  },
);

const colorClass = computed(() => {
  switch (props.color) {
    case "theme":
      return "bg-theme-200/50 shadow-theme-200/50";
    case "themeSecondary":
      return "bg-theme-200/20 shadow-theme-200/25";
    default:
      return "bg-white/20 shadow-theme-200/25";
  }
});
const clickableClass = computed(() => {
  return props.clickable
    ? "hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer"
    : "";
});
</script>
<template>
  <div
    class="glass-card"
    :class="[colorClass, clickableClass]"
    un-rounded="md"
    un-p="x-3 y-2"
    un-backdrop="blur-sm"
    un-shadow="sm"
  >
    <slot />
  </div>
</template>
