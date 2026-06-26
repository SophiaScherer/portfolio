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
 * Resolve the hero image URL used in the first project card. Returns `null`
 * when no image has been published in the CMS — callers are responsible for
 * hiding the image.
 */
export const getHeroImageUrl = async (): Promise<string | null> => {
  const content = await getPortfolioContent();
  return content?.images[0]?.url ?? null;
};