// Downloads the Latin subset of the site's Google Fonts into app/fonts, so the
// build never fetches from Google. Run `npm run fonts` after changing a family
// or its axes, then update the matching entry in app/fonts.ts.

import { writeFile } from "node:fs/promises";

/** `fetch` that fails on an error status instead of parsing or saving the error page. */
async function fetchOk(url, init) {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} from ${url}`);
  return res;
}

const FONTS = {
  "epilogue.woff2": "Epilogue:ital,wght@0,400..900",
  "epilogue-italic.woff2": "Epilogue:ital,wght@1,400..900",
  "plus-jakarta-sans.woff2": "Plus+Jakarta+Sans:wght@400..600",
  "space-grotesk.woff2": "Space+Grotesk:wght@600",
};

const userAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

for (const [file, family] of Object.entries(FONTS)) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${family}&display=swap`;
  const css = await (await fetchOk(cssUrl, { headers: { "User-Agent": userAgent } })).text();
  const fontUrl = css.match(/\/\* latin \*\/[^}]*?url\((https:[^)]+)\)\s*format\(['"]woff2['"]\)/)?.[1];
  if (!fontUrl) throw new Error(`No Latin woff2 URL for ${family}:\n${css}`);

  const font = Buffer.from(await (await fetchOk(fontUrl)).arrayBuffer());
  const output = new URL(`../app/fonts/${file}`, import.meta.url);
  await writeFile(output, font);
  console.log(`Wrote ${font.length} bytes to ${output.pathname}`);
}
