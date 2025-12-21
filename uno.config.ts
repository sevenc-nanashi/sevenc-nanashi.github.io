import { defineConfig, presetWind4 } from "unocss";
import { presetAttributify, presetIcons, transformerDirectives } from "unocss";

export default defineConfig({
  presets: [
    presetWind4(),
    presetIcons({
      customizations: {
        iconCustomizer(collection, icon, props) {
          // customize all icons in this collection
          if (collection === "simple-icons") {
            const [x, y, size, size2] = props.viewBox.split(" ");
            const scale = 1.3;
            const newSizeX = parseFloat(size) * scale;
            const newSizeY = parseFloat(size2) * scale;
            const offsetX = (newSizeX - parseFloat(size)) / 2;
            const offsetY = (newSizeY - parseFloat(size2)) / 2;
            props.viewBox = `${parseFloat(x) - offsetX} ${parseFloat(y) - offsetY} ${newSizeX} ${newSizeY}`;
          }
        },
      },
    }),
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
      mono: "'Firple', 'Remote-Firple', monospace",
    },
  },

  rules: [
    [
      /^align-content-(start|center|end|between|around|evenly)$/,
      ([, v]) => ({
        "align-content": {
          start: "flex-start",
          center: "center",
          end: "flex-end",
          between: "space-between",
          around: "space-around",
          evenly: "space-evenly",
        }[v],
      }),
    ],
    [
      /^grid-area-(.+)$/,
      ([, v]) => ({
        "grid-area": v,
      }),
    ],
    [
      /^user-select-(none|text|all|auto)$/,
      ([, v]) => ({
        "user-select": v,
      }),
    ],
  ],
});
