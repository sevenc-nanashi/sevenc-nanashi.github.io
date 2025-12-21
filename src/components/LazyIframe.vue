<script setup lang="ts">
import { onBeforeUnmount, ref, onMounted, useAttrs } from "vue";

defineOptions({ inheritAttrs: false });

const iframeRef = defineModel<HTMLIFrameElement | null>({
  type: HTMLIFrameElement,
  default: null,
});

const props = withDefaults(
  defineProps<{
    src: string;
    title?: string;
    rootMargin?: string;
    threshold?: number | number[];
  }>(),
  {
    rootMargin: "200px 0px",
    threshold: 0,
  },
);

const attrs = useAttrs();
const isVisible = ref(false);
const target = ref<HTMLDivElement | null>(null);
let observer: IntersectionObserver | null = null;

const stopObserving = () => {
  if (observer && target.value) {
    observer.unobserve(target.value);
  }
  observer?.disconnect();
  observer = null;
};

onMounted(() => {
  if (isVisible.value) return;
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    isVisible.value = true;
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry?.isIntersecting) {
        isVisible.value = true;
        stopObserving();
      }
    },
    { rootMargin: props.rootMargin, threshold: props.threshold },
  );

  if (target.value) {
    observer.observe(target.value);
  }
});

onBeforeUnmount(() => {
  stopObserving();
});
</script>

<template>
  <div ref="target" class="lazy-iframe">
    <iframe
      v-if="isVisible"
      ref="iframeRef"
      :src="props.src"
      :title="props.title"
      v-bind="attrs"
    />
  </div>
</template>

<style scoped>
.lazy-iframe {
  width: 100%;
  height: 100%;
}
</style>
