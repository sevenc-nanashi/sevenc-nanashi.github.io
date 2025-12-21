<script setup lang="ts">
import GlassCard from "../components/GlassCard.vue";
import AsciiProfileIcon from "../components/AsciiProfileIcon.vue";
import { ref } from "vue";
import profileIcon from "../assets/icon.webp";
import { links } from "../profile";

const isSixelMode = ref(true);
</script>
<template>
  <section un-flex-grow un-flex="~" un-justify="center" un-items="center">
    <GlassCard
      class="profile-window"
      color="themeSecondary"
      un-p="2"
      un-gap="6"
    >
      <div
        un-grid-area="header"
        un-font="mono"
        un-border="b theme"
        un-p="x-4 y-2"
      >
        <span un-user-select="none">$ </span>curl "https://sevenc7c.com?<button
          un-text="theme-500"
          un-cursor="pointer"
          un-underline="hover:~"
          @click="isSixelMode = !isSixelMode"
        >
          sixel={{ isSixelMode ? "true" : "false" }}</button
        >"
      </div>
      <div
        un-grid-area="icon"
        un-aspect-ratio="square"
        un-m="l-4 b-4"
        un-font="mono"
        un-size="[21em]"
      >
        <Transition name="pop" mode="out-in">
          <img
            :src="profileIcon"
            v-if="isSixelMode"
            un-h="[21em]"
            un-w="[21em]"
          />
          <AsciiProfileIcon v-else />
        </Transition>
      </div>
      <div un-grid-area="info" un-font="mono" un-text="lg" un-m="r-4 b-4">
        <h1>
          <span un-font="bold" un-text="theme">Nanashi.</span> &lt;<span
            un-text="theme"
            un-font="bold"
            >@sevenc_nanashi</span
          >&gt;
        </h1>
        <div un-h="[1.5em]" un-align-content="center"><hr /></div>
        <template v-for="(link, index) in links" :key="index">
          <div un-gap="2">
            <span
              ><span un-font="bold" un-text="theme"> {{ link.label }} </span>:
            </span>
            <a
              v-if="'url' in link"
              :href="link.url"
              un-text="theme-500 underline"
              target="_blank"
              >{{ link.text || link.url }}</a
            >
            <span v-else>{{ link.text }}</span>
          </div>
        </template>
      </div>
    </GlassCard>
  </section>
</template>

<style scoped>
.profile-window {
  display: grid;
  grid-template-areas:
    "header header"
    "icon info";
}
</style>
