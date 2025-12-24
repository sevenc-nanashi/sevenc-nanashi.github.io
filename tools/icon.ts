import fs from "node:fs";
import { Canvas, Image } from "@napi-rs/canvas";

const image = new Image();
image.src = await fs.promises.readFile(`${import.meta.dirname}/icon.png`);
await new Promise((resolve, reject) => {
  image.onload = () => resolve(true);
  image.onerror = (err) => reject(err);
});

const canvas = new Canvas(image.width, image.height);
const ctx = canvas.getContext("2d");
ctx.fillStyle = "#0099ff";

ctx.drawImage(image, 0, 0);

const fgPalette = new Set<string>();
const bgPalette = new Set<string>();
const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
for (let i = 0; i < data.data.length; i += 4) {
  if (data.data[i + 3] === 0) {
    // rgb(218, 239, 247)
    const ansi = `\x1b[38;2;218;239;247m:\x1b[0m`;
    process.stdout.write(ansi);
    fgPalette.add("218,239,247");
  } else {
    const ansi = `\x1b[48;2;${data.data[i]};${data.data[i + 1]};${data.data[i + 2]}m \x1b[0m`;
    process.stdout.write(ansi);
    bgPalette.add(`${data.data[i]},${data.data[i + 1]},${data.data[i + 2]}`);
  }
  if ((i / 4 + 1) % canvas.width === 0) {
    process.stdout.write("\n");
  }
}
const fgPaletteArr = Array.from(fgPalette);
const bgPaletteArr = Array.from(bgPalette);

const pixels: string[] = [];
const pixelData: {
  type: "fg" | "bg";
  color: [number, number, number];
}[] = [];
for (let i = 0; i < data.data.length; i += 4) {
  if (data.data[i + 3] === 0) {
    const color = `218,239,247`;
    const index = fgPaletteArr.indexOf(color);
    pixels.push(`<div class="fg-${index}">:</div>`);
    pixelData.push({ type: "fg", color: [218, 239, 247] });
  } else {
    const color = `${data.data[i]},${data.data[i + 1]},${data.data[i + 2]}`;
    const index = bgPaletteArr.indexOf(color);
    pixels.push(`<div class="bg-${index}">{{' '}}</div>`);
    pixelData.push({
      type: "bg",
      color: [data.data[i], data.data[i + 1], data.data[i + 2]],
    });
  }
}

const lines: string[] = [];
lines.push("<template>");
lines.push('<div class="profile-icon">');
lines.push(pixels.join(""));
lines.push("</div>");
lines.push("</template>");
lines.push("<style scoped>");
lines.push(
  `.profile-icon { display: grid; grid-template-columns: repeat(${canvas.width}, 1fr); line-height: 1.35em; }`,
);

for (const [index, color] of fgPaletteArr.entries()) {
  lines.push(`.fg-${index} { color: rgb(${color}); }`);
}

for (const [index, color] of bgPaletteArr.entries()) {
  lines.push(`.bg-${index} { background-color: rgb(${color}); white-space: pre; }`);
}

lines.push("</style>");
await fs.promises.writeFile(
  `${import.meta.dirname}/../src/components/AsciiProfileIcon.vue`,
  lines.join("\n"),
);
await fs.promises.writeFile(
  `${import.meta.dirname}/../server/pixelData.json`,
  JSON.stringify(
    {
      width: canvas.width,
      height: canvas.height,
      pixels: pixelData,
      colors: [...fgPalette].concat([...bgPalette]),
    },
    null,
    2,
  ),
);
