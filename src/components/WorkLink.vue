<script setup lang="ts">
import { type Link } from "../works";
import GlassCard from "./GlassCard.vue";

const props = defineProps<{
  link: Link;
}>();

const linkTypes: Record<
  Link["type"],
  {
    label: string;
    icon: string;
  }
> = {
  visit: {
    label: "開く",
    icon: "i-fluent:open-24-regular",
  },
  linkcore: {
    label: "配信リンク",
    icon: "i-fluent:link-24-regular",
  },
  source: {
    label: "ソースコード",
    icon: "i-fluent:code-24-regular",
  },
  niconico: {
    label: "ニコニコ動画",
    icon: "i-simple-icons:niconico",
  },
  youtube: {
    label: "YouTube",
    icon: "i-simple-icons:youtube",
  },
};
</script>

<template>
  <a :href="props.link.url" target="_blank" rel="noopener noreferrer">
    <GlassCard
      clickable
      color="theme"
      class="work-link"
      un-text="theme-700 sm"
      un-flex
      un-items="center"
      un-gap="2"
    >
      <div :class="linkTypes[props.link.type].icon" un-text="xl" />
      {{ linkTypes[props.link.type].label }}
    </GlassCard>
  </a>
</template>
