/**
 * Resized WebP variants of Hygraph assets, built from the asset URL itself so
 * client components can size an image without another CMS round-trip. URLs
 * that aren't Hygraph assets pass through unchanged.
 */

const HYGRAPH_ASSET = /^(https:\/\/[^/]+\.graphassets\.com\/[^/]+)\/([^/]+)$/;

/** `fit:max` never upscales, so a width past the original is harmless. */
export const resizedImage = (url: string, width: number): string => {
  const match = HYGRAPH_ASSET.exec(url);
  if (!match) return url;
  return `${match[1]}/resize=width:${width},fit:max/output=format:webp/${match[2]}`;
};

export const imageSrcSet = (url: string, widths: readonly number[]): string | undefined =>
  HYGRAPH_ASSET.test(url)
    ? widths.map((w) => `${resizedImage(url, w)} ${w}w`).join(", ")
    : undefined;
