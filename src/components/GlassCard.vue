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
      return "glass-card--theme";
    case "themeSecondary":
      return "glass-card--theme-secondary";
    default:
      return "glass-card--neutral";
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
  >
    <slot />
  </div>
</template>
<style lang="scss">
@use "../style.scss" as *;

:root {
  --glass-neutral-bg: #{mix-alpha(#ffffff, 20%)};
  --glass-neutral-shadow: #{mix-alpha(theme("colors.theme.200"), 35%)};
  --glass-theme-bg: #{mix-alpha(theme("colors.theme.200"), 55%)};
  --glass-theme-shadow: #{mix-alpha(theme("colors.theme.300"), 60%)};
  --glass-theme-secondary-bg: #{mix-alpha(theme("colors.theme.200"), 25%)};
  --glass-theme-secondary-shadow: #{mix-alpha(theme("colors.theme.200"), 35%)};

  @media (prefers-color-scheme: dark) {
    --glass-neutral-bg: #{mix-alpha(theme("colors.slate.900"), 55%)};
    --glass-neutral-shadow: #{mix-alpha(theme("colors.slate.950"), 70%)};
    --glass-theme-bg: #{mix-alpha(theme("colors.theme.800"), 45%)};
    --glass-theme-shadow: #{mix-alpha(theme("colors.theme.900"), 55%)};
    --glass-theme-secondary-bg: #{mix-alpha(theme("colors.theme.900"), 35%)};
    --glass-theme-secondary-shadow: #{mix-alpha(theme("colors.theme.900"), 50%)};
  }
}
</style>
<style scoped>
.glass-card {
  --glass-bg: var(--glass-neutral-bg);
  --glass-shadow: var(--glass-neutral-shadow);
  background: var(--glass-bg);
  box-shadow: 0 18px 40px -28px var(--glass-shadow);
}

.glass-card--theme {
  --glass-bg: var(--glass-theme-bg);
  --glass-shadow: var(--glass-theme-shadow);
}

.glass-card--theme-secondary {
  --glass-bg: var(--glass-theme-secondary-bg);
  --glass-shadow: var(--glass-theme-secondary-shadow);
}

.glass-card--neutral {
  --glass-bg: var(--glass-neutral-bg);
  --glass-shadow: var(--glass-neutral-shadow);
}
</style>
