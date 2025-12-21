import voicevoxPreview from "./assets/works/voicevox.webp";
export type WorkCategory = "music" | "app" | "art" | "other";
export type Work = {
  id: string;
  category: WorkCategory;
  title: string;
  description: string;
  display?: Display;
  links: Link[];
};
export type Link = {
  type: "visit" | "source" | "linkcore" | "youtube" | "niconico";
  url: string;
};

export type Display =
  | {
      source: "niconico";
      id: string;
    }
  | {
      source: "image";
      url: string;
    };

export const works: Work[] = [
  {
    category: "app",
    id: "voicevox",
    title: "Voicevox",
    description: "無料・中品質の合成音声ソフト。エディタのメンテナーを担当。",
    links: [
      {
        type: "visit",
        url: "https://voicevox.hiroshiba.jp/",
      },
      {
        type: "source",
        url: "https://github.com/VOICEVOX/voicevox",
      },
    ],
    display: {
      source: "image",
      url: voicevoxPreview,
    },
  },
  {
    category: "app",
    id: "kikoune",
    title: "Kikoune",
    description:
      "Discordのアクティビティで動く、Kiite Cafe風にニコニコ動画を同時再生するアプリ。",
    links: [
      {
        type: "visit",
        url: "https://sevenc7c.com/kikoune/",
      },
      {
        type: "source",
        url: "https://github.com/sevenc-nanashi/kikoune",
      },
    ],
  },
  {
    category: "music",
    id: "exSample",
    title: "eX:SAMPLE",
    description: "AviUtl2のみで作ったテクノミュージック。",
    display: {
      source: "niconico",
      id: "sm45681995",
    },
    links: [
      {
        type: "niconico",
        url: "https://www.nicovideo.jp/watch/sm45681995",
      },
      {
        type: "youtube",
        url: "https://youtu.be/0Adv7O2Qa4Y",
      },
      {
        type: "linkcore",
        url: "https://linkco.re/G2hZE4Nc",
      },
    ],
  },
  {
    category: "music",
    id: "unidentifiedSignpo5ts",
    title: "(unidentified)signpo5ts",
    description: "5作目の自作ボカロ曲。",
    display: {
      source: "niconico",
      id: "sm45306946",
    },
    links: [
      {
        type: "niconico",
        url: "https://www.nicovideo.jp/watch/sm45306946",
      },
      {
        type: "youtube",
        url: "https://youtu.be/0Adv7O2Qa4Y",
      },
      {
        type: "linkcore",
        url: "https://linkco.re/gBaSNthA",
      },
      {
        type: "source",
        url: "https://github.com/sevenc-nanashi/unidentified_signpo5ts",
      },
    ],
  },
  {
    category: "music",
    id: "libraryW4nderers",
    title: "library->w4nderers",
    description: "4作目の自作ボカロ曲。",
    display: {
      source: "niconico",
      id: "sm44670499",
    },
    links: [
      {
        type: "niconico",
        url: "https://www.nicovideo.jp/watch/sm44670499",
      },
      {
        type: "youtube",
        url: "https://youtu.be/Z8ris_-1rVU",
      },
      {
        type: "linkcore",
        url: "https://linkco.re/pNVr2EZv",
      },
      {
        type: "source",
        url: "https://github.com/sevenc-nanashi/library_w4nderers",
      },
    ],
  },
];
