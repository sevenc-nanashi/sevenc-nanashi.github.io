<script setup lang="ts">
import GlassCard from "./components/GlassCard.vue";
import { RouterView } from "vue-router";
import PageSwitcher from "./components/PageSwitcher.vue";
import profileIcon from "./assets/icon_static.webp?h=32;64;96&format=webp;png&as=picture";
import BackgroundCanvas from "./components/BackgroundCanvas.vue";
import ImagetoolsPicture from "./components/ImagetoolsPicture.vue";
</script>

<template>
  <BackgroundCanvas />
  <div un-p="4" un-min-h="screen" class="main" un-flex="~ col">
    <RouterView>
      <template #default="{ Component: ViewComponent }">
        <Transition name="pop" mode="out-in">
          <Component :is="ViewComponent" />
        </Transition>
      </template>
    </RouterView>
    <footer un-mx="auto" un-sticky un-bottom="4" un-w="fit lt-md:full" un-z="10" un-mt="4">
      <GlassCard
        color="theme"
        un-p="4"
        un-text="xl"
        un-flex
        un-items="center"
        un-h="16"
      >
        <ImagetoolsPicture
          :picture="profileIcon"
          alt="Nanashi.'s profile icon"
          title="Nanashi.'s profile icon"
          un-h="8"
          un-w="8"
          un-mr="2"
          sizes="2rem"
        />
        名無し。/ Nanashi.

        <div un-w="8" un-flex-grow="lt-md:~" />

        <PageSwitcher />
      </GlassCard>
    </footer>
  </div>
</template>

<style scoped></style>
