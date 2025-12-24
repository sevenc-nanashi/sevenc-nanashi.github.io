import image from "./pixelData.json";
import * as ansi from "./ansi";
import { getLinks } from "../src/profile";
import sixelImage from "./sixel.txt";

function isTrueish(value: string | null): boolean {
  if (value == null) return false;
  const trueishValues = ["1", "true", "yes", "on"];
  return trueishValues.includes(value.toLowerCase());
}

const themeColor = [0x48, 0xb0, 0xd5] as const;

export default {
  fetch: async (request: Request) => {
    const url = new URL(request.url);
    if (url.pathname !== "/") {
      return fetch(request);
    }

    const userAgent = request.headers.get("User-Agent") || "";
    if (userAgent.includes("Mozilla")) {
      return fetch(request);
    } else {
      const query = new URLSearchParams(url.searchParams);
      const isSixel = isTrueish(query.get("sixel"));
      const output: string[] = [];
      output.push(ansi.cursor.cursorForward(image.width + 4));
      output.push(ansi.cursor.cursorSavePosition);
      output.push(
        `${ansi.rgbForeground(...themeColor) + ansi.bold}${ansi.cursor.link(
          "Nanashi.",
          "https://sevenc7c.com",
        )}${ansi.reset} <${
          ansi.rgbForeground(...themeColor) + ansi.bold
        }@sevenc_nanashi${ansi.reset}>\n`,
      );
      output.push(ansi.cursor.cursorRestorePosition);
      output.push(ansi.cursor.cursorDown(1));
      output.push("--------------------------\n");
      const links = getLinks();
      for (const [i, link] of links.entries()) {
        output.push(ansi.cursor.cursorRestorePosition);
        output.push(ansi.cursor.cursorDown(2 + i));
        output.push(`${ansi.rgbForeground(...themeColor) + ansi.bold}${link.label}${ansi.reset}: `);
        if ("url" in link) {
          output.push(
            `${ansi.rgbForeground(
              ...themeColor,
            )}${ansi.cursor.link(link.text as string, link.url)}${ansi.reset}\n`,
          );
        } else {
          output.push(`${link.text}\n`);
        }
      }
      output.push(ansi.cursor.cursorSavePosition);
      output.push(ansi.cursor.cursorUp(2 + links.length));
      if (isSixel) {
        output.push("\n");
        output.push("  Your terminal does not\n");
        output.push("  support sixel graphics.\n");
        output.push("\n");
        output.push("  Please try with a\n");
        output.push("  sixel-compatible terminal or\n");
        output.push("  try removing `?sixel=true`.\n");
        output.push("\n");
        output.push(ansi.cursor.cursorUp(7));
        output.push(sixelImage);
      } else {
        for (let y = 0; y < image.height; y++) {
          for (let x = 0; x < image.width; x++) {
            const pixel = image.pixels[y * image.width + x];
            const color = pixel.color as [number, number, number];
            if (pixel.type === "bg") {
              output.push(ansi.rgbBackground(...color) + " " + ansi.reset);
            } else {
              output.push(ansi.rgbForeground(...color) + ":" + ansi.reset);
            }
          }
          output.push("\n");
        }
        output.push(ansi.cursor.cursorUp(image.height));
      }
      output.push(ansi.reset);
      output.push(ansi.cursor.cursorRestorePosition);
      return new Response(output.join(""), {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
  },
};
