/** Formats a zero-based list index as a two-digit label, e.g. 0 → "01". */
export const toIndexLabel = (index: number): string =>
  String(index + 1).padStart(2, "0");

/** `_animations.scss` defines `.reveal-delay-1` through `-4`. */
const MAX_REVEAL_DELAY = 4;

/** Stagger class for a step (0 gets none), capped at the longest defined delay. */
export const revealDelayClass = (step: number): string =>
  step > 0 ? `reveal-delay-${Math.min(step, MAX_REVEAL_DELAY)}` : "";
