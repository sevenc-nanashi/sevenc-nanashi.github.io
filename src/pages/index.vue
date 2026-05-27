<script setup lang="ts">
import GlassCard from "../components/GlassCard.vue";
import AsciiProfileIcon from "../components/AsciiProfileIcon.vue";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { z } from "zod";
import profileIcon from "../assets/icon.webp?h=100;300;400;500;700;1000&format=webp;png&as=picture";
import { getLinks } from "../profile";
import animatedIcon100 from "../assets/icon/icon_100x100.webp";
import animatedIcon300 from "../assets/icon/icon_200x200.webp";
import animatedIcon400 from "../assets/icon/icon_400x400.webp";
import animatedIcon500 from "../assets/icon/icon_500x500.webp";
import animatedIcon600 from "../assets/icon/icon_600x600.webp";
import animatedIcon800 from "../assets/icon/icon_800x800.webp";
import animatedIcon1000 from "../assets/icon/icon_1000x1000.webp";

const links = getLinks({
  includeZwsp: true,
});
const route = useRoute();
const router = useRouter();
const sixelQuerySchema = z.union([
  z.literal("true"),
  z.literal("false"),
  z.literal("1"),
  z.literal("yes"),
  z.literal("on"),
  z.literal(""),
  z.null(),
  z.undefined(),
]);
const sixelTrueishValues = ["true", "1", "yes", "on"];
const isSixelMode = computed({
  get() {
    const sixelQuery = sixelQuerySchema.parse(route.query.sixel);
    if (sixelQuery === undefined) {
      return true;
    }
    if (sixelQuery === null) {
      return false;
    }
    return sixelTrueishValues.includes(sixelQuery.toLowerCase());
  },
  set(value) {
    void router.replace({
      query: {
        ...route.query,
        sixel: value ? "true" : "false",
      },
    });
  },
});
function toggleSixelMode() {
  isSixelMode.value = !isSixelMode.value;
}
</script>
<template>
  <section un-flex-grow un-flex="~" un-justify="center" un-items="center">
    <GlassCard class="profile-window" color="themeSecondary" un-p="2" un-gap="6">
      <div un-grid-area="header" un-font="mono" un-border="b theme" un-p="x-4 y-2">
        <span un-user-select="none">$ </span>curl "https://sevenc7c.com?<span
          role="button"
          tabindex="0"
          un-text="theme-500"
          un-cursor="pointer"
          un-underline="hover:~"
          :aria-pressed="isSixelMode"
          @click="toggleSixelMode"
          @keydown.enter.prevent="toggleSixelMode"
          @keydown.space.prevent="toggleSixelMode"
          >sixel={{ isSixelMode ? "true" : "false" }}</span
        >"</div>
      <div
        un-grid-area="icon"
        un-m="md:l-4 md:b-4 lt-md:x-auto"
        un-font="mono"
        un-aspect-ratio="square"
        un-size="[min(21em,_calc(100vw_-_2rem))]"
      >
        <Transition name="pop" mode="out-in">
          <picture v-if="isSixelMode">
            <source
              type="image/webp"
              :srcset="profileIcon.sources.webp"
              sizes="(min-width: 768px) 21em, calc(100vw - 2rem)"
              media="(prefers-reduced-motion: reduce)"
            />
            <source
              type="image/webp"
              :srcset="
                [
                  animatedIcon100 + ' 100w',
                  animatedIcon300 + ' 300w',
                  animatedIcon400 + ' 400w',
                  animatedIcon500 + ' 500w',
                  animatedIcon600 + ' 600w',
                  animatedIcon800 + ' 800w',
                  animatedIcon1000 + ' 1000w',
                ].join(', ')
              "
              sizes="(min-width: 768px) 21em, calc(100vw - 2rem)"
            />
            <source
              type="image/png"
              :srcset="profileIcon.sources.png"
              sizes="(min-width: 768px) 21em, calc(100vw - 2rem)"
            />
            <img
              :src="profileIcon.img.src"
              :width="profileIcon.img.w"
              :height="profileIcon.img.h"
              sizes="(min-width: 768px) 21em, calc(100vw - 2rem)"
              alt="Nanashi.'s profile icon"
              title="Nanashi.'s profile icon"
            />
          </picture>
          <AsciiProfileIcon v-else un-text="lt-md:xs" />
        </Transition>
      </div>
      <div un-grid-area="info" un-font="mono" un-text="lg" un-m="md:r-4 md:b-4">
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
              un-text="theme-500 hover:theme-800 hover:dark:theme-100 underline"
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

@screen lt-md {
  .profile-window {
    grid-template-areas:
      "header"
      "icon"
      "info";
    grid-template-columns: 1fr;
  }
}
</style>
