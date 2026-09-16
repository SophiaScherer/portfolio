/**
 * Site-wide Hygraph content access layer.
 *
 * Goals:
 *   - One GraphQL query per resource (no duplicate round-trips).
 *   - Stable, typed selectors so components don't talk to GraphQL directly.
 *
 * Adding new CMS-managed assets later:
 *   1. Extend the `PORTFOLIO_QUERY` selection set.
 *   2. Add the field to `PortfolioContent`.
 *   3. Expose a selector (e.g. `getProfilePictureUrl()`).
 *
 * No component should construct its own GraphQL query.
 */

import "server-only";

import { request } from "./hygraph";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type HygraphAsset = {
  url: string;
  fileName: string;
  mimeType: string | null;
  width: number | null;
  height: number | null;
};

export type ResumeDownload = {
  url: string;
  fileName: string;
};

export type PortfolioContent = {
  title: string;
  resumeFile: HygraphAsset | null;
  images: HygraphAsset[];
};

export type GalleryImage = {
  url: string;
  alt: string;
};

/* -------------------------------------------------------------------------- */
/* Single shared GraphQL query                                                */
/* -------------------------------------------------------------------------- */

const PORTFOLIO_QUERY = /* GraphQL */ `
  query Portfolio {
    portfolios(first: 1) {
      id
      title
      resumeFile {
        url
        fileName
        mimeType
        width
        height
      }
      images {
        url
        fileName
        mimeType
        width
        height
      }
    }
  }
`;

type PortfolioQueryResponse = {
  portfolios: Array<{
    id: string;
    title: string;
    resumeFile: HygraphAsset | null;
    images: HygraphAsset[];
  }>;
};

/* -------------------------------------------------------------------------- */
/* Selectors                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Fetch the singleton Portfolio entry. Returns `null` if no entry exists.
 * Memoized per-request via the underlying `request()` cache.
 *
 * Never throws. These selectors are awaited directly in the root layout and in
 * `app/page.tsx`, so an unhandled rejection here would fail the entire render —
 * the page would 500 rather than merely lose its CMS-backed assets, and no
 * client component would hydrate. A CMS outage should cost the resume link and
 * one image, not the whole site, so failures are logged and reported as `null`.
 * Every caller below already treats `null` as "not published yet".
 */
export const getPortfolioContent = async (): Promise<PortfolioContent | null> => {
  let data: PortfolioQueryResponse;

  try {
    data = await request<PortfolioQueryResponse>(PORTFOLIO_QUERY);
  } catch (error) {
    console.error(
      "[content] Hygraph request failed; rendering without CMS content.",
      error
    );
    return null;
  }

  const entry = data.portfolios?.[0];
  if (!entry) return null;
  return {
    title: entry.title,
    resumeFile: entry.resumeFile,
    images: entry.images,
  };
};

/**
 * Resolve the resume download URL. Returns `null` when no resume has been
 * published in the CMS — callers are responsible for hiding the link.
 */
export const getResumeDownload = async (): Promise<ResumeDownload | null> => {
  const content = await getPortfolioContent();
  const resume = content?.resumeFile;
  if (!resume?.url) return null;
  return {
    url: resume.url,
    fileName: resume.fileName,
  };
};

/**
 * Published images keyed by file name, for projects to claim by name via
 * `Project.cmsImageFileName`. Keying on the name rather than list position
 * means uploading or reordering assets in the CMS needs no code change, and a
 * project whose asset is absent simply misses the lookup and renders its
 * placeholder.
 *
 * Returns an empty map when the CMS is unreachable or has published nothing.
 */
export const getProjectImageMap = async (): Promise<Record<string, string>> => {
  const content = await getPortfolioContent();
  const byFileName: Record<string, string> = {};
  for (const image of content?.images ?? []) {
    if (!image.fileName || !image.url) continue;
    // Two assets sharing a name would otherwise silently swap a card's image.
    if (byFileName[image.fileName]) {
      console.warn(
        `[content] Duplicate asset fileName "${image.fileName}" — keeping the first.`,
      );
      continue;
    }
    byFileName[image.fileName] = image.url;
  }
  return byFileName;
};

/**
 * A gallery asset's name declares which project it belongs to and its order:
 * `<project-id>-gallery-<n>.<ext>`, e.g. `dash-detective-gallery-1.png`. No
 * per-project field is needed — uploading a new numbered asset is enough to
 * add it to that project's gallery.
 */
const GALLERY_FILENAME = /^(.+)-gallery-(\d+)\.[a-z0-9]+$/i;

/**
 * Gallery images keyed by project id, each list already sorted by its `<n>`.
 * A project with no gallery-named assets simply gets no entry — callers treat
 * a missing key the same as an empty list.
 */
export const getProjectGalleryMap = async (): Promise<
  Record<string, GalleryImage[]>
> => {
  const content = await getPortfolioContent();
  // Keyed by index per project so two assets at the same position collide
  // explicitly instead of both silently appearing — same intent as the
  // duplicate check in `getProjectImageMap` above.
  const withIndex: Record<string, Map<number, GalleryImage>> = {};

  for (const asset of content?.images ?? []) {
    if (!asset.url) continue;
    const match = GALLERY_FILENAME.exec(asset.fileName ?? "");
    if (!match) continue;
    // Project ids are lowercase kebab-case; lowercasing here means an
    // inconsistently-cased upload still finds its project instead of
    // silently missing the lookup in `Projects.tsx`.
    const projectId = match[1].toLowerCase();
    const index = Number(match[2]);

    const byIndex = (withIndex[projectId] ??= new Map());
    if (byIndex.has(index)) {
      console.warn(
        `[content] Duplicate gallery index ${index} for "${projectId}" (asset "${asset.fileName}") — keeping the first.`,
      );
      continue;
    }
    byIndex.set(index, { url: asset.url, alt: asset.fileName });
  }

  const byProjectId: Record<string, GalleryImage[]> = {};
  for (const [projectId, byIndex] of Object.entries(withIndex)) {
    byProjectId[projectId] = [...byIndex.entries()]
      .sort(([a], [b]) => a - b)
      .map(([, image]) => image);
  }
  return byProjectId;
};
