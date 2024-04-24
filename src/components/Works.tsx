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
      "音声読み上げソフト。マルチエンジンや複数選択などの機能を開発。",
    sevenbotDescription: "Discordの多機能Bot。",
    dotfilesDescription: "コンフィグファイル達。",
    discorbDescription: "DiscordのAPIラッパー。",
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
      "A TTS software. Developed features such as multi-engine and multiple selection.",
    sevenbotDescription: "A multi-functional Discord bot.",
    dotfilesDescription: "My configurations.",
    discorbDescription: "A Discord API wrapper.",
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
