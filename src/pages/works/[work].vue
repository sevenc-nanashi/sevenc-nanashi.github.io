<script setup lang="ts" generic="T extends string">
import { works, type Work, type WorkCategory } from "../../works";
import GlassCard from "../../components/GlassCard.vue";
import WorksDisplay from "../../components/WorksDisplay.vue";
import { computed, ref } from "vue";
import WorksLink from "../../components/WorksLink.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const work = computed(() => {
  const workId = route.params.work as string;
  return works.find((w) => w.id === workId) as Work;
});
</script>
<template>
  <GlassCard>
    <h2 un-text="2xl">{{ work.title }}</h2>
    <div un-flex un-items="center">
      <WorksLink
        v-for="(link, key) in work.links"
        :key="key"
        :link="link"
        un-mr="4"
      />
    </div>
    <p>{{ work.description }}</p>
    <WorksDisplay v-if="work.display" :display="work.display" />
  </GlassCard>
</template>

<style scoped></style>
