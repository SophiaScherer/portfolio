"use client";

import { useEffect, useState } from "react";

/**
 * Reports whether an element is visible within a scroll container (or the
 * viewport when `root` is omitted). Returns a callback ref, so it works for
 * elements that mount after the component does. Defaults to `true` until the
 * first observation, so nothing flashes into its "scrolled away" state.
 */
export function useInView<T extends Element>(
  root?: Element | null,
  rootMargin = "0px",
): [ref: (node: T | null) => void, inView: boolean] {
  const [node, setNode] = useState<T | null>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    // A `null` root means the container hasn't mounted yet; wait for it.
    if (!node || root === null) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { root, rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node, root, rootMargin]);

  return [setNode, inView];
}
