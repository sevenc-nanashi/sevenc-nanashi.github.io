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

const zwsp = "\u200b";

// NOTE: Cloudflare Workersだとnew Dateがおかしくなるので遅延評価にする
export function getLinks({
  includeZwsp,
}: {
  includeZwsp?: boolean;
} = {}): LinkData[] {
  const maybeZwsp = includeZwsp ? zwsp : "";
  const birthDate = new Date("2006-12-25");
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  const currentAge = age;

  return [
    {
      label: "Role",
      text: "Programmer / Music Composer / Pixel Artist",
    },
    {
      label: "Languages",
      text: "Japanese (Native), English",
    },
    {
      label: "University",
      text: "The University of Electro-Communications",
    },
    {
      label: "Birthday",
      text: "2006-12-25",
    },
    {
      label: "Age",
      text: `${currentAge} years old`,
    },
    {
      url: "mailto:sevenc7c@sevenc7c.com",
      label: "Email",
      text: `sevenc7c${maybeZwsp}@sevenc7c.com`,
    },
    {
      url: "https://github.com/sevenc-nanashi",
      label: "GitHub",
      text: "@sevenc-nanashi",
    },
    {
      url: "https://huggingface.co/sevenc-nanashi",
      label: "HuggingFace",
      text: "@sevenc-nanashi",
    },
    {
      url: "https://voskey.icalo.net/@sevenc_nanashi",
      label: "Misskey",
      text: `@sevenc_nanashi${maybeZwsp}@voskey.icalo.net`,
    },
    {
      url: "https://twitter.com/sevenc_nanashi",
      label: "Twitter",
      text: "@sevenc_nanashi",
    },
    {
      url: "https://www.nicovideo.jp/user/90184991",
      label: "Niconico",
      text: `/user${zwsp}/90184991`,
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
      url: "https://vocadb.net/Profile/sevenc_nanashi",
      label: "VocaDB",
      text: `/Profile${maybeZwsp}/sevenc_nanashi`,
    },
    {
      url: "https://www.tunecore.co.jp/artists/sevenc-nanashi",
      label: "TuneCore",
      text: `/artists${maybeZwsp}/sevenc-nanashi`,
    },
    {
      url: "https://atcoder.jp/users/MNoNamer",
      label: "AtCoder",
      text: `/users${maybeZwsp}/MNoNamer`,
    },
    {
      url: "https://zenn.dev/mnonamer",
      label: "Zenn",
      text: "/mnonamer",
    },
    {
      url: "https://qiita.com/sevenc-nanashi",
      label: "Qiita",
      text: "/sevenc-nanashi",
    },
  ];
}
