"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

/**
 * Tracks the active slide of a horizontal scroll-snap track and scrolls to a
 * slide on demand. The track's direct children are the slides. Harmless when
 * the track isn't scrollable (e.g. the desktop grid layout): no scroll events
 * fire, so the index simply stays at 0.
 */
export function useCarouselIndex<T extends HTMLElement = HTMLElement>(): {
  trackRef: RefObject<T>;
  activeIndex: number;
  scrollToIndex: (index: number) => void;
} {
  const trackRef = useRef<T>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Offset of a slide from the track's snap edge (its inline-start padding).
  const offsetFromStart = useCallback((track: T, slide: Element) => {
    const padding = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    return (
      slide.getBoundingClientRect().left -
      track.getBoundingClientRect().left -
      padding
    );
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const slides = Array.from(track.children);
      if (slides.length === 0) return;

      // The last slide can't reach the snap edge, so treat max scroll as it.
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScroll - 2) {
        setActiveIndex(slides.length - 1);
        return;
      }

      let nearest = 0;
      slides.forEach((slide, i) => {
        const distance = Math.abs(offsetFromStart(track, slide));
        if (distance < Math.abs(offsetFromStart(track, slides[nearest]))) {
          nearest = i;
        }
      });
      setActiveIndex(nearest);
    };

    // Throttled to one measurement per frame while swiping.
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [offsetFromStart]);

  // Smoothness comes from the track's CSS `scroll-behavior`, so reduced-motion
  // rules in the stylesheet also apply here.
  const scrollToIndex = useCallback(
    (index: number) => {
      const track = trackRef.current;
      const slide = track?.children[index];
      if (!track || !slide) return;
      track.scrollTo({ left: track.scrollLeft + offsetFromStart(track, slide) });
    },
    [offsetFromStart],
  );

  return { trackRef, activeIndex, scrollToIndex };
}
