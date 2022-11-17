import { Index, Show, For, createResource, Resource } from "solid-js"
import { getFromCookie, storeToCookie } from "~/utils"

const works: {
  name: string
  url: string
  label: string
  description: string
  color?: string
  footerUrl?: string
  footerText?: string
  github?: string
}[] = [
  {
    name: "SevenBot",
    url: "https://sevenbot.jp",
    description: "Discordの多機能Bot。",
    label: "|SevenBot-dev/|SevenBot",
    footerUrl: "https://github.com/SevenBot-dev/SevenBot",
    footerText: "SevenBot|#1769|",
    github: "sevenbot-dev/sevenbot",
  },
  {
    name: "discorb",
    url: "https://discorb-lib.github.io",
    description: "Ruby製のDiscord APIラッパー。",
    label: "|discorb-lib/|discorb",
    footerUrl: "https://github.com/discorb-lib/discorb",
    footerText: "|gem install |discorb",
    github: "discorb-lib/discorb",
  },
  {
    name: "Kiite Cafe Desktop",
    url: "https://github.com/sevenc-nanashi/kiitecafe-desktop/releases/latest",
    description: "Kiite Cafeのデスクトップ版。",
    label: "|sevenc-nanashi/|kiitecafe-desktop",
    footerUrl: "https://github.com/sevenc-nanashi/kiitecafe-desktop",
    github: "sevenc-nanashi/kiitecafe-desktop",
  },
  {
    name: "Sonolus SCP Converter",
    url: "https://sevenc7c.com/scp-converter",
    description:
      "Sonolus v0.5.13で作成されたSCPファイルをv0.6.0で読み込めるように変換するツール。",
    label: "|sevenc-nanashi/|scp-converter",
    footerUrl: "https://github.com/sevenc-nanashi/scp-converter",
    github: "sevenc-nanashi/scp-converter",
  },
]
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
  return (
    <div class="flex flex-wrap place-content-between">
      <Index each={works}>
        {(work) => (
          <div class="backdrop-blur-[2px] bg-theme bg-opacity-[2%] rounded-xl flex flex-col overflow-hidden w-full lg:w-[calc(50%_-_8px)] box-border mb-2">
            <a href={work().url} target="_blank" rel="noopener">
              <div
                class="md:h-10 bg-opacity-20 p-2 px-4 cursor-pointer underline font-semibold"
                classList={{
                  [work().color || "bg-theme"]: true,
                }}
              >
                {work().name}
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
              </div>
            </a>
            <div class="p-2 flex flex-col">
              <p class="md:h-12 mb-2 px-2 md:px-4 text-justify flex-grow">
                {work().description}
              </p>
              <p class="mt-auto">
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
                    <For each={work().footerText!.split("|")}>
                      {(label, i) =>
                        label && (
                          <span
                            classList={{
                              "text-theme": i() % 2 === 0,
                              "text-slate-500 dark:text-slate-400":
                                i() % 2 === 1,
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
          </div>
        )}
      </Index>
    </div>
  )
}

export default Works
