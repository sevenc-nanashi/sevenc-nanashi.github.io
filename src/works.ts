export type WorkCategory = "music" | "app" | "art" | "other";
export type Work = {
  id: string;
  category: WorkCategory;
  title: string;
  description: string;
  display: Display;
  links: Link[];
};
export type Link = {
  type: "visit" | "source";
  url: string;
};

export type Display = {
  source: "niconico";
  id: string;
};

export const works: Work[] = [
  {
    category: "app",
    id: "voicevox",
    title: "Voicevox",
    description: "無料・中品質の合成音声ソフト。エディタのメンテナーを担当。",
    display: {
      source: "niconico",
      id: "sm44670499",
    },
    links: [
      {
        type: "visit",
        url: "https://www.nicovideo.jp/watch/sm44670499",
      },
      {
        type: "source",
        url: "https://github.com/sevenc-nanashi/library_w4nderers",
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
        type: "visit",
        url: "https://www.nicovideo.jp/watch/sm44670499",
      },
      {
        type: "source",
        url: "https://github.com/sevenc-nanashi/library_w4nderers",
      },
    ],
  },
];
