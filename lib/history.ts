/** History helpers shared by the overlays that give themselves a history entry. */

type OverlayState = { overlay?: string } | null;

/** Which overlay pushed the current history entry, if any. */
export const currentOverlay = (): string | undefined =>
  (window.history.state as OverlayState)?.overlay;

let backPending = false;

/**
 * `history.back()`, ignoring repeat calls until the resulting `popstate`
 * arrives, so a double click can't step back past the overlay's entry.
 */
export function historyBack(): void {
  if (backPending) return;
  backPending = true;
  window.addEventListener("popstate", () => (backPending = false), { once: true });
  window.history.back();
}
