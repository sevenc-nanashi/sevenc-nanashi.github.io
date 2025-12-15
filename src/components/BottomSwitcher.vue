<script setup lang="ts" generic="T extends string">
import GlassCard from "./GlassCard.vue";

const props = defineProps<{
  sections: Record<T, string>;
}>();
const selected = defineModel<T>({
  required: true,
});
</script>
<template>
  <GlassCard class="work-switcher" color="themeSecondary" un-p="x-4 y-4">
    <button
      v-for="(section, key) in props.sections"
      :key="key"
      :class="{ selected: selected === key }"
      @click="selected = key as T"
    >
      {{ section }}
    </button>
  </GlassCard>
</template>

<style scoped>
.work-switcher {
  & > button {
    background: transparent;
    cursor: pointer;

    color: theme("colors.text");
    &.selected {
      color: theme("colors.theme.500");
    }

    &:not(:last-child) {
      margin-right: 1rem;
      &::after {
        content: "|";
        margin-left: 1rem;
        color: theme("colors.slate.500");
        opacity: 0.5;
      }
    }
  }
}
</style>
