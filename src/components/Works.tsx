import {
  Index,
  Show,
  For,
  createResource,
  Resource,
  useContext,
} from "solid-js"
import { Locale } from "~/locale"
import { getFromCookie, storeToCookie } from "~/utils"

const works = [
  {
    id: "voicevox",
    name: "Voicevox",
    url: "https://github.com/voicevox/voicevox",
    label: "|voicevox/|voicevox",
    footerUrl: "https://github.com/voicevox/voicevox",
    footerText: "",
    github: "voicevox/voicevox",
    language: "(as a Contributor)",
  },
  {
    id: "2Lyrics",
    name: "2>lyrics.txt",
    url: "https://www.nicovideo.jp/watch/sm43945652",
    label: "|sevenc-nanashi/|2_lyrics",
    footerUrl: "https://github.com/sevenc-nanashi/2_lyrics",
    footerText: "",
    github: "sevenc-nanashi/2_lyrics",
    language: "TypeScript (p5.js), Original Song",
  },
  {
    id: "expla1nSelf",
    name: "expla1n(self)",
    url: "https://www.nicovideo.jp/watch/sm43690833",
    label: "|sevenc-nanashi/|expla1n_self",
    footerUrl: "https://github.com/sevenc-nanashi/expla1n_self",
    footerText: "",
    github: "sevenc-nanashi/expla1n_self",
    language: "TypeScript (p5.js), Original Song",
  },
  {
    id: "kikoune",
    name: "Kikoune",
    url: "https://github.com/sevenc-nanashi/kikoune",
    label: "|sevenc-nanashi/|kikoune",
    footerUrl: "https://kw.sevenc7c.com",
    footerText: "",
    github: "sevenc-nanashi/kikoune",
    language: "TypeScript (Hono, Vue)",
  },
  // {
  //   id: "discorb",
  //   name: "discorb",
  //   url: "https://discorb-lib.github.io",
  //   label: "|discorb-lib/|discorb",
  //   footerUrl: "https://github.com/discorb-lib/discorb",
  //   footerText: "|gem install |discorb",
  //   github: "discorb-lib/discorb",
  //   language: "Ruby (Async)",
  // },
  // {
  //   id: "sevenbot",
  //   name: "SevenBot",
  //   url: "https://sevenbot.jp",
  //   label: "|SevenBot-dev/|SevenBot",
  //   footerUrl: "https://github.com/SevenBot-dev/SevenBot",
  //   footerText: "SevenBot|#1769|",
  //   github: "sevenbot-dev/sevenbot",
  //   language: "Python (discord.py)",
  // },
  {
    id: "cantari",
    name: "Cantari",
    url: "https://www.nicovideo.jp/watch/sm43856969",
    label: "|sevenc-nanashi/|cantari",
    footerUrl: "https://github.com/sevenc-nanashi/cantari",
    footerText: "",
    github: "sevenc-nanashi/cantari",
    language: "Rust (axum)",
  },
  {
    id: "aiVoiceVox",
    name: "AIVoiceVox",
    url: "https://www.nicovideo.jp/watch/sm43073706",
    label: "|sevenc-nanashi/|aivoice-vox",
    footerUrl: "https://github.com/sevenc-nanashi/aivoice-vox",
    footerText: "",
    github: "sevenc-nanashi/aivoice-vox",
    language: "Rust (axum), C++",
  },
  {
    id: "coeiroinkV2Bridge",
    name: "Coeiroink v2 bridge",
    url: "https://www.nicovideo.jp/watch/sm43073706",
    label: "|sevenc-nanashi/|coeiroink-v2-bridge",
    footerUrl: "https://github.com/sevenc-nanashi/coeiroink-v2-bridge",
    footerText: "",
    github: "sevenc-nanashi/coeiroink-v2-bridge",
    language: "Deno (Hono)",
  },
  {
    id: "kiitecafeDesktop",
    name: "Kiite Cafe Desktop",
    url: "https://github.com/sevenc-nanashi/kiitecafe-desktop/releases/latest",
    label: "|sevenc-nanashi/|kiitecafe-desktop",
    footerUrl: "https://github.com/sevenc-nanashi/kiitecafe-desktop",
    footerText: "",
    github: "sevenc-nanashi/kiitecafe-desktop",
    language: "Vue (TypeScript + Electron + Vite)",
  },
  {
    id: "kiiteitte",
    name: "Kiiteitte Web",
    url: "https://kw.sevenc7c.com",
    label: "|sevenc-nanashi/|kiiteitte-web",
    footerUrl: "https://github.com/sevenc-nanashi/kiiteitte-web",
    footerText: "",
    github: "sevenc-nanashi/kiiteitte-web",
    language: "Hono + Vue (TypeScript + Vite)",
  },
  {
    id: "dotfiles",
    name: "dotfiles",
    url: "https://github.com/sevenc-nanashi/dotfiles",
    label: "|sevenc-nanashi/|dotfiles",
    footerUrl: "https://github.com/sevenc-nanashi/dotfiles",
    footerText: "",
    github: "sevenc-nanashi/dotfiles",
    language: "Vim, PowerShell, etc...",
  },
  {
    id: "discordColorSimulator",
    name: "Discord Color Simulator",
    url: "https://sevenc7c.com/discord-color-simulator",
    label: "|sevenc-nanashi/|discord-color-simulator",
    footerUrl: "https://github.com/sevenc-nanashi/discord-color-simulator",
    footerText: "",
    github: "sevenc-nanashi/discord-color-simulator",
    language: "SolidJS (TypeScript + Vite + Tailwind CSS)",
  },
  {
    id: "sevenc7cCom",
    name: "sevenc7c.com",
    url: "https://sevenc7c.com/",
    label: "|sevenc-nanashi/|sevenc-nanashi.github.io",
    footerUrl: "https://github.com/sevenc-nanashi/sevenc-nanashi.github.io",
    footerText: "",
    github: "sevenc-nanashi/sevenc-nanashi.github.io",
    language: "SolidJS (TypeScript + Vite + Tailwind CSS)",
  },
] as const satisfies {
  id: string
  name: string
  url: string
  label: string
  color?: string
  footerUrl?: string
  footerText: string | undefined
  github?: string
  language: string
}[]
const fetchRepoData = async (repo: string) => {
  const [username, repoName] = repo.split("/")
  if (getFromCookie(repo)) {
    return JSON.parse(getFromCookie(repo)!)
  }
  const result = await fetch(
    `https://api.github.com/repos/${username}/${repoName}`
  )
    .then((r) => r.json())
    .then((t) => {
      return {
        stars: t.stargazers_count,
        forks: t.forks_count,
      }
    })
  storeToCookie(repo, JSON.stringify(result))
  return result
}
export const translations = {
  ja: {
    voicevoxDescription:
      "音声読み上げソフト。マルチエンジン、マルチトラック、複数選択などの機能を開発。",
    expla1nSelfDescription: "自作曲。1作目。映像をp5.jsで制作。",
    "2LyricsDescription": "自作曲。2作目。映像をp5.jsで制作。",
    kikouneDescription: "Kiite Cafe風にニコニコ動画を同時再生するDiscordアクティビティ。",
    sevenbotDescription: "Discordの多機能Bot。",
    dotfilesDescription: "コンフィグファイル達。",
    discorbDescription: "DiscordのAPIラッパー。",
    cantariDescription: "UTAU音源をVoicevox上で話させるVoicevoxエンジン。",
    aiVoiceVoxDescription:
      "A.I.Voice 1をVoicevox上で話させるVoicevoxエンジン。",
    coeiroinkV2BridgeDescription:
      "Coeiroink v2をVoicevox上で話させるVoicevoxエンジン。",
    kiitecafeDesktopDescription: "Kiite Cafeのデスクトップ版。",
    kiiteitteDescription: "Kiite Cafeの選曲履歴を表示するWebアプリ。",
    sonolusScpConverterDescription:
      "SonolusのSCPファイルをv0.5.13用からv0.6.0用に変換するツール。",
    discordColorSimulatorDescription:
      "Discordの3つのテーマで見え方をシミュレーションするアプリ。",
    sevenc7cComDescription: "自分のプロフィール。（このサイト）",
  },
  en: {
    voicevoxDescription:
      "A TTS software. Developed features such as: multi-engine, multi-track, and multiple selection.",
    expla1nSelfDescription: "My first original song. The video was made with p5.js.",
    "2LyricsDescription": "My second original song. The video was made with p5.js.",
    sevenbotDescription: "A multi-functional Discord bot.",
    kikouneDescription: "A discord activity which plays NND like Kiite Cafe.",
    dotfilesDescription: "My configurations.",
    discorbDescription: "A Discord API wrapper.",
    cantariDescription:
      "An engine for Voicevox which lets UTAUs speak on Voicevox.",
    aiVoiceVoxDescription:
      "An engine for Voicevox which lets A.I.Voice 1 speak on Voicevox.",
    coeiroinkV2BridgeDescription:
      "An engine for Voicevox which lets Coeiroink v2 speak on Voicevox.",
    kiitecafeDesktopDescription: "A desktop version of Kiite Cafe.",
    kiiteitteDescription: "A web app to show the song history of Kiite Cafe.",
    sonolusScpConverterDescription:
      "A tool to convert SCP files from Sonolus v0.5.13 to v0.6.0.",
    discordColorSimulatorDescription:
      "An app to simulate how it looks in 3 Discord themes.",
    sevenc7cComDescription: "My profile. (This site)",
  },
}
const Works = () => {
  const githubStats: Record<
    string,
    Resource<{ stars: string; forks: string }>
  > = Object.fromEntries(
    works
      .map((w) => w.github)
      .filter((g) => g)
      .map((r) => [r, createResource(r, fetchRepoData)[0]])
  )
  const locale = useContext(Locale)
  const texts = () => translations[locale()]
  return (
    <div class="flex flex-wrap place-content-between">
      <Index each={works}>
        {(work) => (
          <div class="backdrop-blur-[2px] bg-theme bg-opacity-[2%] rounded-xl flex flex-col overflow-hidden w-full lg:w-[calc(50%_-_8px)] box-border mb-2 relative pb-8">
            <a href={work().url} target="_blank" rel="noopener">
              <div class="md:h-14 bg-opacity-20 p-2 px-4 cursor-pointer font-semibold overflow-visible bg-theme">
                <span class="underline">{work().name}</span>
                <Show when={work().github}>
                  <Show
                    when={githubStats[work().github!].loading}
                    fallback={
                      <div class="float-right">
                        <span class="font-bold">☆</span>{" "}
                        {githubStats[work().github!]()!.stars}{" "}
                      </div>
                    }
                  >
                    ...
                  </Show>
                </Show>
                <Show when={work().language}>
                  <div class="text-xs">{work().language}</div>
                </Show>
              </div>
            </a>
            <div class="p-2 flex flex-col relative">
              <p class="md:min-h-12 mb-2 px-2 md:px-4 text-justify flex-grow">
                {texts()[`${work().id}Description`]}
              </p>
            </div>

            <p class="bottom-2 px-2 absolute">
              <a
                href={work().footerUrl || work().url}
                class="text-theme text-xs md:text-sm mt-auto px-2 md:px-4"
                target="_blank"
                rel="noopener"
              >
                <For each={work().label.split("|")}>
                  {(label, i) =>
                    label && (
                      <span
                        classList={{
                          "text-theme underline font-bold": i() % 2 === 0,
                          "text-slate-500 dark:text-slate-400": i() % 2 === 1,
                        }}
                      >
                        {label}
                        {"\u200b"}
                      </span>
                    )
                  }
                </For>
                <Show when={work().footerText}>
                  <span class="text-slate-500 dark:text-slate-400">
                    {" | "}
                  </span>
                  <For each={work().footerText.split("|")}>
                    {(label, i) =>
                      label && (
                        <span
                          classList={{
                            "text-theme": i() % 2 === 0,
                            "text-slate-500 dark:text-slate-400": i() % 2 === 1,
                          }}
                        >
                          {label}
                        </span>
                      )
                    }
                  </For>
                </Show>
              </a>
            </p>
          </div>
        )}
      </Index>
    </div>
  )
}

export default Works
