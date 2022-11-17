import {
  Component,
  createSignal,
  JSX,
  onCleanup,
  onMount,
} from "solid-js"
import "./App.css"

import icon from "./assets/icon.png"
import AboutMe from "./components/AboutMe"
import Accounts from "./components/Accounts"
import Works from "./components/Works"

declare function particlesJS(id: string, options: unknown): void

const Section: Component<{
  title: string
  class: string
  children: JSX.Element
}> = (props) => (
  <div class="" classList={{ [props.class]: true }}>
    <div class="text-lg font-bold bg-theme bg-opacity-50 py-3 px-4 rounded-xl backdrop-blur-sm">
      {props.title}
    </div>
    <div class="mt-2 mb-4">{props.children}</div>
  </div>
)

let particleInterval: number | null = null
function App() {
  const [particlesInitialized, setParticlesInitialized] = createSignal(false)
  onMount(() => {
    const tryParticle = () => {
      if (
        typeof particlesJS === "function" &&
        !particlesInitialized() &&
        (document.querySelector("#bg-polygon-canvas") as HTMLDivElement)
          .clientWidth > window.innerWidth
      ) {
        setParticlesInitialized(true)
        particlesJS("bg-polygon-canvas", {
          particles: {
            number: {
              value: 100,
              density: {
                enable: false,
              },
            },
            line_linked: {
              color: "#48b0d5",
            },
            color: {
              value: "#48b0d5",
            },
            size: {
              value: 3,
              random: false,
            },
          },
          interactivity: {
            events: {
              onhover: {
                enable: false,
              },
              onclick: {
                enable: false,
              },
            },
          },
        })
      } else {
        requestAnimationFrame(tryParticle)
      }
    }
    particleInterval = requestAnimationFrame(tryParticle)
  })
  onCleanup(() => {
    if (particleInterval) {
      cancelAnimationFrame(particleInterval)
    }
  })
  return (
    <div class="flex flex-col left-0 top-0 right-0 h-content min-h-screen absolute">
      <div class="bg-theme dark:bg-theme-dark text-white h-32 flex items-center z-10">
        <div class="text-5xl md:text-6xl font-extrabold ml-8 md:ml-16">
          名無し｡
        </div>
        <img class="ml-auto h-full" src={icon} />
      </div>
      <div class="flex m-8 flex-wrap flex-grow relative z-10" id="content">
        <Section title="About me" class="w-full">
          <AboutMe />
        </Section>
        <div style="flex-grow: 1" />
        <Section title="Accounts" class="w-full md:w-[33%]">
          <Accounts />
        </Section>
        <Section title="Works" class="ml-auto w-full md:w-[66%]">
          <Works />
        </Section>

        <div class="absolute inset-0 min-h-screen opacity-60 -z-10 overflow-hidden">
          <div id="bg-polygon-canvas" class="-inset-12 absolute" />
        </div>
      </div>
    </div>
  )
}

export default App
