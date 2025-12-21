import voicevoxPreview from "./assets/works/voicevox.webp";
import kiiteitteWebPreview from "./assets/works/kiiteitte-web.webp";

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
  type: "visit" | "source" | "linkcore" | "youtube" | "niconico" | "download";
  url: string;
};

export type Display =
  | {
      source: "niconico";
      id: string;
    }
  | {
      source: "youtube";
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
    id: "kiiteitteWeb",
    title: "Kiiteitte Web",
    description:
      "Kiite Cafeの選曲履歴を表示するWebアプリ。ActivityPub対応により、Misskey等のFediverseクライアントからも閲覧可能。",
    links: [
      {
        type: "visit",
        url: "https://kw.sevenc7c.com",
      },
      {
        type: "source",
        url: "https://github.com/sevenc-nanashi/kiiteitte-web",
      },
    ],
    display: {
      source: "image",
      url: kiiteitteWebPreview,
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
    category: "app",
    id: "cantari",
    title: "Cantari",
    description: "UTAU音源をVoicevox上で話させるVoicevoxエンジン。",
    display: {
      source: "niconico",
      id: "sm43856969",
    },
    links: [
      {
        type: "download",
        url: "https://github.com/sevenc-nanashi/cantari/releases/latest",
      },
      {
        type: "niconico",
        url: "https://www.nicovideo.jp/watch/sm43856969",
      },
      {
        type: "source",
        url: "https://github.com/sevenc-nanashi/cantari",
      },
    ],
  },
  {
    category: "app",
    id: "aivoicevox",
    title: "AIVoiceVox",
    description: "A.I.Voice 1をVoicevox上で話させるVoicevoxエンジン。",
    display: {
      source: "niconico",
      id: "sm43073706",
    },
    links: [
      {
        type: "download",
        url: "https://github.com/sevenc-nanashi/aivoice-vox/releases/latest",
      },
      {
        type: "niconico",
        url: "https://www.nicovideo.jp/watch/sm43073706",
      },
      {
        type: "source",
        url: "https://github.com/sevenc-nanashi/aivoice-vox",
      },
    ],
  },
  {
    category: "app",
    id: "coeiroinkV2Bridge",
    title: "Coeiroink v2 Bridge",
    description: "Coeiroink v2をVoicevox上で話させるVoicevoxエンジン。",
    display: {
      source: "niconico",
      id: "sm43073706",
    },
    links: [
      {
        type: "download",
        url: "https://github.com/sevenc-nanashi/coeiroink-v2-bridge/releases/latest",
      },
      {
        type: "niconico",
        url: "https://www.nicovideo.jp/watch/sm43073706",
      },
      {
        type: "source",
        url: "https://github.com/sevenc-nanashi/coeiroink-v2-bridge",
      },
    ],
  },
  {
    category: "music",
    id: "exSample",
    title: "eX:SAMPLE",
    description: "AviUtl2のみで作ったテクノミュージック。Re:ENCODE参加作品。",
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
    description: "5作目の自作ボカロ曲。ボカコレ2025夏参加作品。",
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
    description:
      "オリジナルのボカロ曲。ボカコレ2025冬ルーキー部門参加作品。楽曲収益化サービスのイチオシ賞受賞作品。",
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
  {
    category: "music",
    id: "favorit3sRespect",
    title: "favorit3s.respect",
    description:
      "界隈・模倣曲を中心としたメドレー。ボカコレ2025冬Remix部門参加作品。",
    display: {
      source: "niconico",
      id: "sm44635263",
    },
    links: [
      {
        type: "niconico",
        url: "https://www.nicovideo.jp/watch/sm44635263",
      },
      {
        type: "youtube",
        url: "https://youtu.be/zuQapTlfrdk",
      },
      {
        type: "source",
        url: "https://github.com/sevenc-nanashi/favorit3s_respect",
      },
    ],
  },
  {
    category: "music",
    id: "untitledCyanvas2",
    title: "Untitled Cyanvas (2)",
    description: "Chart Cyanvas 2周年書き下ろし曲。",
    display: {
      source: "youtube",
      id: "UqxoCw3caLs",
    },
    links: [
      {
        type: "youtube",
        url: "https://youtu.be/UqxoCw3caLs",
      },
      {
        type: "linkcore",
        url: "https://n0.com/a/5dy6dby5x3ni",
      },
      {
        type: "source",
        url: "https://github.com/sevenc-nanashi/untitled_cyanvas_2",
      },
    ],
  },
  {
    category: "music",
    id: "2LyricsTxt",
    title: "2>lyrics.txt",
    description: "オリジナルのボカロ曲。ぼかえり2024夏参加作品。",
    display: {
      source: "niconico",
      id: "sm43945652",
    },
    links: [
      {
        type: "niconico",
        url: "https://www.nicovideo.jp/watch/sm43945652",
      },
      {
        type: "youtube",
        url: "https://youtu.be/UqxoCw3caLs",
      },
      {
        type: "source",
        url: "https://github.com/sevenc-nanashi/2_lyrics",
      },
    ],
  },
  {
    category: "music",
    id: "expla1nSelf",
    title: "expla1n(self)",
    description: "オリジナルのボカロ曲。VOICEVOXソング機能リリース記念作品。",
    display: {
      source: "niconico",
      id: "sm43690833",
    },
    links: [
      {
        type: "niconico",
        url: "https://www.nicovideo.jp/watch/sm43690833",
      },
      {
        type: "youtube",
        url: "https://youtu.be/W-k-ii_XtaM",
      },
      {
        type: "source",
        url: "https://github.com/sevenc-nanashi/expla1n_self",
      },
    ],
  },
];
