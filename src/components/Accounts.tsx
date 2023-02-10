import { createResource, For, Index, Show } from "solid-js"
import { getFromCookie, storeToCookie } from "~/utils"

const accounts: {
  id: string
  name: string
  url: string
  label: string
  color?: string
}[] = [
  {
    id: "misskey",
    name: "Misskey",
    url: "https://misskey.io/@sevenc7c",
    label: "@sevenc7c|@misskey.io",
    color: "bg-green-300",
  },
  {
    id: "twitter",
    name: "Twitter",
    url: "https://twitter.com/sevenc_nanashi",
    label: "@sevenc_nanashi",
    color: "bg-blue-300",
  },
  {
    id: "github",
    name: "GitHub",
    url: "https://github.com/sevenc-nanashi",
    label: "/sevenc-nanashi",
    color: "bg-gray-300",
  },
  {
    id: "discord",
    name: "Discord",
    url: "https://discord.com/users/686547120534454315",
    label: "Nanashi.|#7740",
    color: "bg-purple-300",
  },
  {
    id: "youtube",
    name: "YouTube",
    url: "https://youtube.com/@sevenc-nanashi",
    label: "@sevenc-nanashi",
    color: "bg-red-300",
  },
  {
    id: "niconico",
    name: "Niconico",
    url: "https://www.nicovideo.jp/user/90184991",
    label: "|/user|/90184991",
    color: "bg-slate-100",
  },
  {
    id: "qiita",
    name: "Qiita",
    url: "https://qiita.com/sevenc-nanashi",
    label: "/sevenc-nanashi",
    color: "bg-green-300",
  },
  {
    id: "zenn",
    name: "Zenn",
    url: "https://zenn.dev/mnonamer",
    label: "/mnonamer",
    color: "bg-blue-300",
  },
]
const fetchShieldsData = async (url: string) => {
  if (getFromCookie(url)) {
    return JSON.parse(getFromCookie(url)!)
  }
  const result = await fetch(
    `${
      url.startsWith("https://") ? url : "https://img.shields.io/" + url
    }?style=flat-square&label=`
  )
    .then((r) => r.text())
    .then((t) => {
      const parser = new DOMParser()
      const xml = parser.parseFromString(t, "application/xml")
      return xml.querySelector("text")!.innerHTML
    })
  storeToCookie(url, JSON.stringify(result))
  return result
}

const fetchQiitaData = async () => {
  if (getFromCookie("qiita")) {
    return JSON.parse(getFromCookie("qiita")!)
  }
  console.log("fetching qiita data")
  console.log(getFromCookie("qiita"))
  const result = await fetch(
    "https://qiita.com/api/v2/users/sevenc-nanashi"
  ).then((r) => r.json())
  storeToCookie("qiita", JSON.stringify(result))
  return result
}

const Accounts = () => {
  const [qiitaFollowers] = createResource(fetchQiitaData)
  const [youtubeSubscribers] = createResource(
    "youtube/channel/subscribers/UCv9Wgrqn0ovYhUggSSm5Qtg",
    fetchShieldsData
  )
  const [githubFollowers] = createResource(
    "github/followers/sevenc-nanashi",
    fetchShieldsData
  )
  const profileInfo: Record<string, () => false | string> = {
    qiita: () =>
      qiitaFollowers.loading
        ? false
        : `${qiitaFollowers().followees_count} Followers`,
    youtube: () =>
      youtubeSubscribers.loading
        ? false
        : `${youtubeSubscribers()} Subscribers`,
    github: () =>
      githubFollowers.loading ? false : `${githubFollowers()} Followers`,
  }
  return (
    <div class="flex-col">
      <Index each={accounts}>
        {(account) => (
          <a
            href={account().url}
            class="mt-2 first:mt-0 block"
            target="_blank"
            rel="noopener me"
          >
            <div class="backdrop-blur-[2px] bg-theme bg-opacity-[2%] hover:bg-opacity-10 rounded-xl flex overflow-hidden">
              <div
                class="w-1/3 bg-opacity-20 p-2 px-4 font-semibold"
                classList={{
                  [account().color || "bg-theme"]: true,
                }}
              >
                {account().name}
              </div>
              <div class="p-2 flex flex-col">
                <div>
                  <For each={account().label.split("|")}>
                    {(label, i) =>
                      label && (
                        <span
                          classList={{
                            "text-theme underline font-bold": i() % 2 === 0,
                            "text-slate-500 dark:text-slate-400": i() % 2 === 1,
                          }}
                        >
                          {label}
                        </span>
                      )
                    }
                  </For>
                </div>
                <Show when={account().id in profileInfo}>
                  <div class="text-xs text-slate-500 dark:text-slate-400">
                    {profileInfo[account().id]() || "..."}
                  </div>
                </Show>
              </div>
            </div>
          </a>
        )}
      </Index>
    </div>
  )
}

export default Accounts
