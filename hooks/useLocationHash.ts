"use client";

import { useSyncExternalStore } from "react";

/** `pushState` and `replaceState` fire no events, so writes below notify these directly. */
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("popstate", listener);
  window.addEventListener("hashchange", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("popstate", listener);
    window.removeEventListener("hashchange", listener);
  };
}

/** The current `location.hash`, including the `#`. Empty during SSR. */
export function useLocationHash(): string {
  return useSyncExternalStore(
    subscribe,
    () => window.location.hash,
    () => "",
  );
}

/**
 * Sets the hash (`""` clears it) in the current history entry, or in a new one
 * with `push`, and notifies `useLocationHash` readers.
 */
export function setLocationHash(
  hash: string,
  { push = false, state = null }: { push?: boolean; state?: unknown } = {},
): void {
  const url = `${window.location.pathname}${window.location.search}${hash}`;
  if (push) window.history.pushState(state, "", url);
  else window.history.replaceState(state, "", url);
  listeners.forEach((listener) => listener());
}
