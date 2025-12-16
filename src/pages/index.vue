<script setup lang="ts">
type LinkData =
  | {
      label: string;
      url: string;
      text?: string;
    }
  | {
      label: string;
      text: string;
    };
// const linkData = {
//   GitHub: "https://github.com/sevenc-nanashi",
//   Twitter: "https://twitter.com/sevenc_nanashi",
//   Misskey: "https://voskey.icalo.net/@sevenc_nanashi"
// };
const links: LinkData[] = [
  {
    url: "https://github.com/sevenc-nanashi",
    label: "GitHub",
    text: "@sevenc-nanashi",
  },
  {
    url: "https://twitter.com/sevenc_nanashi",
    label: "Twitter",
    text: "@sevenc_nanashi",
  },
  {
    url: "https://voskey.icalo.net/@sevenc_nanashi",
    label: "Misskey",
    text: "@sevenc_nanashi@voskey.icalo.net",
  },
  {
    url: "https://www.nicovideo.jp/user/90184991",
    label: "Niconico",
    text: "/user/90184991",
  },
  {
    url: "https://youtube.com/@sevenc-nanashi",
    label: "YouTube",
    text: "@sevenc-nanashi",
  },
  {
    url: "https://discord.com/users/686547120534454315",
    label: "Discord",
    text: "@sevenc_nanashi",
  },

  {
    url: "https://zenn.dev/mnonamer",
    label: "Zenn",
    text: "/mnonamer",
  },
  {
    url: "https://vocadb.net/Profile/sevenc_nanashi",
    label: "VocaDB",
    text: "/Profile/sevenc_nanashi",
  },
  {
    url: "https://www.tunecore.co.jp/artists/sevenc-nanashi",
    label: "TuneCore",
    text: "/artists/sevenc-nanashi",
  },
];
</script>
<template>
  <section
    un-flex-grow
    un-flex="~"
    un-justify="center"
    un-items="center"
    un-gap="4"
  >
    <div
      un-size="100"
      un-bg="gray-200"
      un-flex
      un-items-center
      un-justify-center
    >
      <div>Icon Placeholder</div>
    </div>
    <div un-font="mono" un-text="lg">
      <h1>
        <span un-font="bold" un-text="theme">Nanashi.</span> &lt;<span
          un-text="theme"
          un-font="bold"
          >@sevenc_nanashi</span
        >&gt;
      </h1>
      <div un-h="[1em]" un-align-content="center"><hr /></div>
      <template v-for="(link, index) in links" :key="index">
        <div un-grid="~ cols-[auto_1fr]" un-gap="2">
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
  </section>
</template>

<style scoped></style>
