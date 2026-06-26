/**
 * Site-wide Hygraph content access layer.
 *
 * Goals:
 *   - One GraphQL query per resource (no duplicate round-trips).
 *   - Stable, typed selectors so components don't talk to GraphQL directly.
 *   - Sensible fallbacks to `/public` assets while content is being seeded.
 *
 * Adding new CMS-managed assets later:
 *   1. Extend the `PORTFOLIO_QUERY` selection set.
 *   2. Add the field to `PortfolioContent`.
 *   3. Expose a selector (e.g. `getProfilePictureUrl()`).
 *
 * No component should construct its own GraphQL query.
 */

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

export type PortfolioContent = {
  title: string;
  resumeFile: HygraphAsset | null;
  images: HygraphAsset[];
};

/* -------------------------------------------------------------------------- */
/* Fallbacks (public assets that ship with the repo)                          */
/* -------------------------------------------------------------------------- */

const FALLBACK_RESUME_URL = "/Sophia_s_Resume.pdf";
const FALLBACK_RESUME_FILENAME = "Sophia_Resume.pdf";
const FALLBACK_HERO_IMAGE_URL = "/vectorVisPicture.png";

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
 */
export const getPortfolioContent = async (): Promise<PortfolioContent | null> => {
  const data = await request<PortfolioQueryResponse>(PORTFOLIO_QUERY);
  const entry = data.portfolios[0];
  if (!entry) return null;
  return {
    title: entry.title,
    resumeFile: entry.resumeFile,
    images: entry.images,
  };
};

/**
 * Resolve the resume download URL, falling back to the bundled PDF in `/public`
 * until the CMS asset is published.
 */
export const getResumeDownload = async (): Promise<{ url: string; fileName: string }> => {
  const content = await getPortfolioContent();
  const resume = content?.resumeFile;
  if (!resume?.url) {
    return { url: FALLBACK_RESUME_URL, fileName: FALLBACK_RESUME_FILENAME };
  }
  return {
    url: resume.url,
    fileName: resume.fileName || FALLBACK_RESUME_FILENAME,
  };
};

/**
 * Resolve the hero image URL used in the first project card. Falls back to the
 * bundled PNG in `/public` until the CMS asset is published.
 */
export const getHeroImageUrl = async (): Promise<string> => {
  const content = await getPortfolioContent();
  return content?.images[0]?.url ?? FALLBACK_HERO_IMAGE_URL;
};