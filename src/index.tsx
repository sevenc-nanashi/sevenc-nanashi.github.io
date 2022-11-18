/* @refresh reload */
import "./index.css"
import { onMount } from "solid-js"
import { render } from "solid-js/web"
import { I18nContext, createI18nContext, useI18n } from "@solid-primitives/i18n"

import App, { translations } from "./App"

const Index = () => {
  const [_, { locale }] = useI18n()
  onMount(() => {
    const lang = navigator.language.split("-")[0]
    if (lang in translations) {
      locale(lang)
    } else {
      locale("en")
    }
  })
  return <App />
}

const i18n = createI18nContext(
  translations as unknown as Record<string, Record<string, string>>
)
render(
  () => (
    <I18nContext.Provider value={i18n}>
      <Index />
    </I18nContext.Provider>
  ),
  document.getElementById("root") as HTMLElement
)
