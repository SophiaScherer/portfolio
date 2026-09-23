"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useModal } from "../hooks/useModal";

export type LightboxImage = { url: string; alt: string };

type LightboxProps = {
  images: LightboxImage[];
  /** Which image is showing, or `null` when the viewer is closed. */
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

/**
 * Full-size viewer for a project's header and gallery images, opened from
 * `ProjectModal`. Always mounted so it can transition out; `index === null`
 * is the closed state.
 */
export default function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
}: LightboxProps) {
  const open = index !== null;
  const dialogRef = useModal<HTMLDivElement>({ open, onClose });

  // Portals need a DOM node to target, which doesn't exist while rendering on
  // the server.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Hold the last index so the image and counter survive the close
  // transition — `index` drops to null the moment the viewer starts fading,
  // which would otherwise blank the image and reset the counter mid-fade.
  // Clamped because `images` can shrink underneath a fading viewer: closing
  // the case study drops its gallery, leaving the held index past the end.
  const lastIndex = useRef(0);
  if (index !== null) lastIndex.current = index;
  const shownIndex = Math.min(index ?? lastIndex.current, images.length - 1);

  /** Moves `delta` images, wrapping at both ends. */
  const step = useCallback(
    (delta: number) => {
      if (images.length < 2) return;
      onNavigate((shownIndex + delta + images.length) % images.length);
    },
    [shownIndex, images.length, onNavigate],
  );

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") step(1);
      else if (event.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, step]);

  if (!mounted) return null;

  const shown = images[shownIndex] ?? null;
  const hasNav = images.length > 1;

  // Rendered into <body> so it can layer above the case-study modal, which is
  // also a body-level portal.
  //
  // The whole layer carries the dialog role, not just the image's frame:
  // `useModal` looks for focusable controls inside the element it's given, and
  // the close and nav buttons sit outside the frame so they keep their
  // viewport-edge offsets whatever the image's aspect ratio. Pointing the ref
  // at the frame would leave all three unreachable by Tab.
  return createPortal(
    <div
      className={`lightbox ${open ? "is-open" : ""}${hasNav ? " has-nav" : ""}`}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label={shown?.alt || "Image viewer"}
      tabIndex={-1}
      ref={dialogRef}
    >
      <div className="lightbox-backdrop" onClick={onClose} aria-hidden="true" />

      <div className="lightbox-frame">
        {shown && <img src={shown.url} alt={shown.alt} className="lightbox-img" />}
      </div>

      {/* Controls follow the frame in the DOM so they paint above the image —
          a wide one would otherwise cover them and swallow their clicks. */}
      <button
        type="button"
        className="lightbox-close"
        onClick={onClose}
        aria-label="Close image viewer"
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          close
        </span>
      </button>

      {hasNav && (
        <div className="lightbox-controls">
          <button
            type="button"
            className="lightbox-nav lightbox-prev"
            onClick={() => step(-1)}
            aria-label="Previous image"
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              chevron_left
            </span>
          </button>

          <div className="lightbox-count">
            {shownIndex + 1} / {images.length}
          </div>

          <button
            type="button"
            className="lightbox-nav lightbox-next"
            onClick={() => step(1)}
            aria-label="Next image"
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              chevron_right
            </span>
          </button>
        </div>
      )}
    </div>,
    document.body,
  );
}
