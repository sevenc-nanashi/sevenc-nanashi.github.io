<script setup lang="ts">
import GlassCard from "./components/GlassCard.vue";
import { RouterView } from "vue-router";
import PageSwitcher from "./components/PageSwitcher.vue";
</script>

<template>
  <div un-p="4" un-min-h="screen" class="main" un-flex="~ col">
    <RouterView>
      <template #default="{ Component: ViewComponent }">
        <Transition name="fade" mode="out-in">
          <Component :is="ViewComponent" />
        </Transition>
      </template>
    </RouterView>
    <footer un-mx="auto" un-sticky un-bottom="4" un-w="fit">
      <GlassCard color="theme" un-p="4" un-text="xl" un-flex un-items="center">
        <div un-bg="white" un-w="8" un-mr="2" un-text-center un-aspect-square>
          I
        </div>
        名無し。/ Nanashi.

        <div un-w="4" />

        <PageSwitcher />
      </GlassCard>
    </footer>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
