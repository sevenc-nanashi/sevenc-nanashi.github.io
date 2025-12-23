<script setup lang="ts">
import type { Picture } from "dummy?as=picture";

defineOptions({
  inheritAttrs: false,
});
const props = defineProps<{
  picture: Picture;
  sizes?: string;
}>();
</script>
<template>
  <picture>
    <source
      v-for="(srcset, type) in props.picture.sources"
      :key="type"
      :type="`image/${type}`"
      :srcset="srcset"
      :sizes="props.sizes"
    />
    <img
      :src="props.picture.img.src"
      :width="props.picture.img.w"
      :height="props.picture.img.h"
      :sizes="props.sizes"
      v-bind="$attrs"
    />
  </picture>
</template>
