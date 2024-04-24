import { Index, Show, useContext } from "solid-js"
import { Locale } from "~/locale"

const aboutMeBadges: {
  name: string
  color: string
  url?: string
  content?: string
}[] = [
  {
    name: "Ruby",
    color: "bg-red-300",
    url: "https://github.com/sevenc-nanashi?tab=repositories&q=&type=&language=ruby",
  },
  {
    name: "TypeScript",
    color: "bg-blue-300",
    url: "https://github.com/sevenc-nanashi?tab=repositories&q=&type=&language=typescript",
  },
  {
    name: "JavaScript",
    color: "bg-yellow-300",
    url: "https://github.com/sevenc-nanashi?tab=repositories&q=&type=&language=javascript",
  },
  {
    name: "Python",
    color: "bg-blue-300",
    url: "https://github.com/sevenc-nanashi?tab=repositories&q=&type=&language=python",
  },
  {
    name: "Rust",
    color: "bg-red-300",
    url: "https://github.com/sevenc-nanashi?tab=repositories&q=&type=&language=rust",
  },
  {
    name: "DTM",
    color: "bg-orange-300",
  },
  {
    name: "p5.js",
    color: "bg-pink-300",
  },
  {
    name: "Illust",
    color: "bg-slate-300",
  },
  {
    name: "Birthday",
    color: "bg-slate-300",
    content: "2006/12/25",
  },
  {
    name: "Age",
    color: "bg-slate-300",
    content: "17",
  },
  {
    name: "Location",
    color: "bg-slate-300",
    content: "Shizuoka, Japan",
  },
]

export const translations = {
  ja: {
    aboutMe:
      "好きなものを、好きなもので、好きなように作る。「ものを創るもの」を造るのが好き。高校3年生。",
  },
  en: {
    aboutMe:
      "Make things I like, with things I like, as I like to do. I like to make things which makes other things. 3nd year high school student.",
  },
}

const AboutMe = () => {
  const locale = useContext(Locale)
  const texts = () => translations[locale()]
  return (
    <>
      <p>{texts().aboutMe}</p>

      <div class="flex flex-wrap mt-4">
        <Index each={aboutMeBadges}>
          {(badge) => (
            <Show
              when={badge().content}
              fallback={
                <Show
                  when={badge().url}
                  fallback={
                    <div class="mb-2 mr-2 rounded bg-opacity-[2%] dark:bg-opacity-10 bg-theme backdrop-blur-sm flex flex-row overflow-hidden">
                      <div
                        classList={{
                          [badge().color]: true,
                        }}
                        class="py-2 px-4 bg-opacity-30 font-semibold"
                      >
                        {badge().name}
                      </div>
                    </div>
                  }
                >
                  <a
                    class="mb-2 mr-2 py-2 px-4 rounded bg-opacity-30 hover:bg-opacity-50 backdrop-blur-sm font-semibold"
                    classList={{
                      [badge().color]: true,
                    }}
                    href={badge().url ?? "#!"}
                    target="_blank"
                    rel="noopener"
                  >
                    {badge().name}
                  </a>
                </Show>
              }
            >
              <div class="mb-2 mr-2 rounded bg-opacity-[2%] dark:bg-opacity-10 bg-theme backdrop-blur-sm flex flex-row overflow-hidden">
                <div
                  classList={{
                    [badge().color]: true,
                  }}
                  class="py-2 px-4 bg-opacity-30 font-semibold"
                >
                  {badge().name}
                </div>
                <div class="py-2 px-4">{badge().content}</div>
              </div>
            </Show>
          )}
        </Index>
      </div>
    </>
  )
}

export default AboutMe
