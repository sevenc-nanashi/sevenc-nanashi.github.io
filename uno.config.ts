import { defineConfig, presetWind4 } from "unocss";
import { presetAttributify, presetIcons, transformerDirectives } from "unocss";

export default defineConfig({
  presets: [
    presetWind4(),
    presetIcons({}),
    presetAttributify({
      prefixedOnly: true,
    }),
  ],
  transformers: [transformerDirectives()],
  theme: {
    colors: {
      text: "var(--theme-text)",
      theme: {
        DEFAULT: "#48B0D5",
        50: "#DDF0F7",
        100: "#CDE9F3",
        200: "#ACDBEC",
        300: "#8ACDE4",
        400: "#69BEDD",
        500: "#48B0D5",
        600: "#2B95BA",
        700: "#20708D",
        800: "#164C5F",
        900: "#0B2731",
        950: "#06151A",
      },
    },
    font: {
      sans: "'Zen Kaku Gothic New', sans-serif",
    },
  },

  rules: [],
});
