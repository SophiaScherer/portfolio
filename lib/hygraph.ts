/**
 * Server-side Hygraph (GraphQL) client.
 *
 * Used exclusively from React Server Components, route handlers, and other
 * server-side code. Never import this from a `"use client"` module.
 *
 * Caching:
 *   - The shared `request()` helper is wrapped with React's `cache()` so a
 *     single server render performs each query at most once even when several
 *     components call it.
 *   - `next: { revalidate, tags }` opts into Next.js's Data Cache so subsequent
 *     requests get the cached payload until the tag is invalidated.
 */

import { cache } from "react";

const HYGRAPH_ENDPOINT = process.env.HYGRAPH_ENDPOINT;
const HYGRAPH_TOKEN = process.env.HYGRAPH_TOKEN;

if (!HYGRAPH_ENDPOINT) {
  throw new Error(
    "HYGRAPH_ENDPOINT is not set. Configure it in .env.local before using the Hygraph client."
  );
}

if (!HYGRAPH_TOKEN) {
  throw new Error(
    "HYGRAPH_TOKEN is not set. Configure it in .env.local before using the Hygraph client."
  );
}

export type GraphQLResponse<T> = {
  data?: T;
  errors?: ReadonlyArray<{ message: string }>;
};

type RequestOptions = {
  variables?: Record<string, unknown>;
  /**
   * Cache strategy forwarded to Next.js fetch.
   * Default: revalidate every 60 seconds, tagged with `hygraph` for
   * selective invalidation via `revalidateTag("hygraph")`.
   */
  revalidate?: number | false;
  tags?: string[];
};

async function requestUncached<T>(
  query: string,
  { variables, revalidate = 60, tags = ["hygraph"] }: RequestOptions = {}
): Promise<T> {
  const res = await fetch(HYGRAPH_ENDPOINT as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${HYGRAPH_TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate, tags },
  });

  if (!res.ok) {
    throw new Error(
      `Hygraph request failed: ${res.status} ${res.statusText}`
    );
  }

  const payload = (await res.json()) as GraphQLResponse<T>;

  if (payload.errors?.length) {
    throw new Error(
      `Hygraph returned errors: ${payload.errors.map((e) => e.message).join("; ")}`
    );
  }

  if (payload.data === undefined) {
    throw new Error("Hygraph response missing data field.");
  }

  return payload.data;
}

/**
 * Shared, per-request memoized GraphQL fetcher.
 *
 * Two layers of caching:
 *   1. `cache()` deduplicates identical (query, variables) calls within a
 *      single server render.
 *   2. Next.js's Data Cache stores the response across requests for
 *      `revalidate` seconds, invalidatable via `revalidateTag`.
 */
export const request = cache(requestUncached);