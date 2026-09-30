// Downloads the Material Symbols subset the site uses into app/fonts, so the
// icon font is self-hosted. Add an icon name below, then run `npm run icons`;
// an icon missing from the list renders as its raw name.

import { writeFile } from "node:fs/promises";

const ICONS = [
  "arrow_forward",
  "arrow_outward",
  "check_circle",
  "chevron_left",
  "chevron_right",
  "close",
  "code",
  "code_blocks",
  "dark_mode",
  "devices",
  "handshake",
  "insights",
  "layers",
  "light_mode",
  "lightbulb",
  "location_on",
  "mail",
  "person",
  "pets",
  "settings",
  "terminal",
];

const OUTPUT = new URL("../app/fonts/material-symbols-outlined.woff2", import.meta.url);

// The API needs the names sorted, and serves woff2 only to modern browsers.
const cssUrl =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@400,0..1" +
  `&icon_names=${[...ICONS].sort().join(",")}&display=block`;
const userAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

const css = await (await fetch(cssUrl, { headers: { "User-Agent": userAgent } })).text();
const fontUrl = css.match(/url\((https:[^)]+)\)\s*format\(['"]woff2['"]\)/)?.[1];
if (!fontUrl) throw new Error(`No woff2 URL in the stylesheet:\n${css}`);

const font = Buffer.from(await (await fetch(fontUrl)).arrayBuffer());
await writeFile(OUTPUT, font);
console.log(`Wrote ${font.length} bytes for ${ICONS.length} icons to ${OUTPUT.pathname}`);
