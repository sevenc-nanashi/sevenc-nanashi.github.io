<script setup lang="ts" generic="T extends string">
import { RouterLink } from "vue-router";
import { type Work } from "../works";
import GlassCard from "./GlassCard.vue";
import LazyIframe from "./LazyIframe.vue";
import WorkLink from "./WorkLink.vue";
import { onMounted, onUnmounted, ref, useId } from "vue";

const props = defineProps<{
  work: Work;
}>();

const iframe = ref<HTMLIFrameElement | null>(null);
const messageAbort = new AbortController();
const id = useId();

type NiconicoEvents = {
  loadComplete: {
    videoInfo: {
      commentCount: number;
      description: string;
      lengthInSeconds: number;
      mylistCount: number;
      postedAt: Date;
      thumbnailUrl: string;
      title: string;
      videoId: string;
      viewCount: number;
      watchId: number;
    };
  };
  playerMetadataChange: {
    currentTime: number;
    duration: number;
    isVideoMetaDataLoaded: boolean;
    maximumBuffered: number;
    muted: boolean;
    showComment: boolean;
    volume: number;
  };
  playerStatusChange: {
    playerStatus: number;
  };
  statusChange: {
    playerStatus: number;
    seekStatus: number;
  };
};
type NiconicoMessage = {
  [K in keyof NiconicoEvents]: {
    playerId: string;
    sourceConnectorType: number;
    eventName: K;
    data: NiconicoEvents[K];
  };
}[keyof NiconicoEvents];

let firstLoad = true;
onMounted(() => {
  if (
    props.work.display?.source === "niconico" &&
    "start" in props.work.display
  ) {
    // 開始地点指定のpolyfill
    window.addEventListener(
      "message",
      (event) => {
        if (!iframe.value || props.work.display?.source !== "niconico") {
          return;
        }
        if (!firstLoad) {
          return;
        }
        const message: NiconicoMessage = event.data;
        if (message.playerId !== id) {
          return;
        }
        if (
          message.eventName === "playerMetadataChange" &&
          message.data.maximumBuffered > 0
        ) {
          firstLoad = false;
          const contentWindow = iframe.value.contentWindow;
          if (!contentWindow) {
            throw new Error("Iframe has no contentWindow");
          }
          const start = (
            "start" in props.work.display ? props.work.display.start : 0
          ) as number;
          contentWindow.postMessage(
            {
              sourceConnectorType: 1,
              playerId: id,
              eventName: "seek",
              data: {
                time: start * 1000,
              },
            },
            "https://embed.nicovideo.jp",
          );
        }
      },
      { signal: messageAbort.signal },
    );
  }
});
onUnmounted(() => {
  messageAbort.abort();
});
</script>
<template>
  <GlassCard color="themeSecondary">
    <h2 un-text="2xl" un-mb="2">
      <RouterLink
        :to="`#${props.work.id}`"
        un-text="theme-700 hover:theme-500 dark:theme-200 dark:hover:theme-100"
        un-decoration="none"
      >
        {{ props.work.title }}
      </RouterLink>
    </h2>
    <div un-flex="~ wrap" un-items="center" un-gap="2" un-mb="2">
      <WorkLink
        v-for="(link, key) in props.work.links"
        :key="key"
        :link="link"
      />
    </div>
    <hr un-mb="2" un-text="theme-100" />
    <p un-mb="2">{{ props.work.description }}</p>
    <div class="work-display">
      <div v-if="!props.work.display" un-aspect="16/9" un-relative>
        <div
          un-relative
          un-aspect="16/9"
          un-w="full"
          class="work-placeholder"
          un-grid
          un-justify="center"
          un-items="center"
          un-text="xl"
        >
          No Preview
        </div>
      </div>
      <div v-else un-aspect="16/9" un-relative>
        <div
          un-absolute
          un-aspect="16/9"
          un-w="full"
          class="work-placeholder"
          un-opacity="20%"
          un-grid
          un-justify="center"
          un-items="center"
          un-text="xl"
        >
          Loading...
        </div>

        <div
          v-if="props.work.display.source === 'image'"
          un-absolute
          un-aspect="16/9"
          un-w="full"
          un-object="cover"
          un-overflow="hidden"
        >
          <img
            :src="props.work.display.url"
            loading="lazy"
            :alt="`${props.work.title} preview`"
            :title="props.work.title"
            un-absolute
            un-aspect="16/9"
            un-w="full"
            un-blur="md"
            un-object="cover"
            un-drop-shadow="md"
          />
          <img
            :src="props.work.display.url"
            loading="lazy"
            :alt="`${props.work.title} preview`"
            :title="props.work.title"
            un-absolute
            un-aspect="16/9"
            un-w="full"
            un-object="contain"
          />
        </div>
        <LazyIframe
          v-if="props.work.display.source === 'youtube'"
          :src="
            'start' in props.work.display
              ? `https://www.youtube.com/embed/${props.work.display.id}?start=${props.work.display.start}`
              : `https://www.youtube.com/embed/${props.work.display.id}`
          "
          width="100%"
          height="100%"
          frameborder="0"
          allowfullscreen
          allow="autoplay; encrypted-media; picture-in-picture"
          un-relative
        />
        <LazyIframe
          v-if="props.work.display.source === 'niconico'"
          v-model="iframe"
          name="test"
          :src="
            'start' in props.work.display
              ? `https://embed.nicovideo.jp/watch/${props.work.display.id}?jsapi=1&playerId=${id}`
              : `https://embed.nicovideo.jp/watch/${props.work.display.id}`
          "
          width="100%"
          height="100%"
          frameborder="0"
          allowfullscreen
          allow="autoplay; encrypted-media; picture-in-picture"
          un-relative
        />
      </div>
    </div>
  </GlassCard>
</template>

<style scoped lang="scss">
@use "../style.scss" as *;

.work-placeholder {
  background: light-dark(
    #{mix-alpha(theme("colors.slate.100"), 85%)},
    #{mix-alpha(theme("colors.gray.800"), 75%)}
  );
  color: light-dark(theme("colors.slate.500"), theme("colors.slate.300"));
}
</style>
