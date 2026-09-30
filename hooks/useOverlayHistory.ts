"use client";

import { useCallback, useEffect, useRef } from "react";

type OverlayState = { overlay?: string } | null;

const currentOverlay = () => (window.history.state as OverlayState)?.overlay;

/**
 * Gives an overlay its own history entry while it's open, so the browser's
 * Back button (or Android's back gesture) closes it instead of leaving the
 * page. Close the overlay through the returned function, which pops that
 * entry, so the history stays balanced.
 */
export function useOverlayHistory(
  key: string,
  open: boolean,
  onClose: () => void,
): () => void {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    if (currentOverlay() !== key) {
      window.history.pushState({ overlay: key }, "", window.location.href);
    }
    const onPopState = () => {
      if (currentOverlay() !== key) onCloseRef.current();
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [key, open]);

  return useCallback(() => {
    if (currentOverlay() === key) window.history.back();
    else onCloseRef.current();
  }, [key]);
}
