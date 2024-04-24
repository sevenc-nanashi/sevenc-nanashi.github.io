/* @refresh reload */
import "./index.css"
import { createSignal, onMount } from "solid-js"
import { render } from "solid-js/web"

import App from "./App"
import { Locale } from "./locale"

const Index = () => {
  const [locale, setLocale] = createSignal<"ja" | "en">("en")
  onMount(() => {
    const lang = navigator.language.split("-")[0]
    setLocale(lang === "ja" ? "ja" : "en")
  })
  return (
    <Locale.Provider value={locale}>
      <App />
    </Locale.Provider>
  )
}

render(() => <Index />, document.getElementById("root") as HTMLElement)
