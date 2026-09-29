"use client";

import { useEffect, useRef, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import { useIsClient } from "../hooks/useIsClient";
import { useModal } from "../hooks/useModal";
import { imageSrcSet, resizedImage } from "../lib/images";

export type LightboxImage = {
  url: string;
  alt: string;
  width?: number | null;
  height?: number | null;
};

type LightboxProps = {
  images: LightboxImage[];
  /** Which image is showing, or `null` when the viewer is closed. */
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

/** Horizontal travel, in px, that counts as a swipe. */
const SWIPE_DISTANCE = 50;

const wrap = (i: number, n: number) => (i + n) % n;

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
  const isClient = useIsClient();
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  // A swipe that ends on the backdrop would otherwise also count as a click.
  const swiped = useRef(false);

  const canNavigate = open && images.length > 1;
  const step = (delta: number) => onNavigate(wrap((index ?? 0) + delta, images.length));

  useEffect(() => {
    if (!canNavigate) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") onNavigate(wrap((index ?? 0) + 1, images.length));
      else if (event.key === "ArrowLeft") onNavigate(wrap((index ?? 0) - 1, images.length));
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [canNavigate, index, images.length, onNavigate]);

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") swipeStart.current = { x: event.clientX, y: event.clientY };
  };
  const onPointerUp = (event: PointerEvent) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    swiped.current = false;
    if (!start || !canNavigate) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) >= SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy)) {
      swiped.current = true;
      step(dx < 0 ? 1 : -1);
    }
  };
  const onBackdropClick = () => {
    if (swiped.current) swiped.current = false;
    else onClose();
  };

  if (!isClient) return null;

  const shown = index !== null ? images[index] : null;

  // Rendered into <body> so it can layer above the case-study modal, which is
  // also a body-level portal.
  return createPortal(
    <div
      className={`lightbox ${open ? "is-open" : ""}`}
      aria-hidden={!open}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (swipeStart.current = null)}
    >
      <div className="lightbox-backdrop" onClick={onBackdropClick} aria-hidden="true" />

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

      {images.length > 1 && (
        <>
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
        </>
      )}

      <div
        className="lightbox-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={shown?.alt || "Image viewer"}
        tabIndex={-1}
        ref={dialogRef}
      >
        {shown && (
          <img
            src={resizedImage(shown.url, 1600)}
            srcSet={imageSrcSet(shown.url, [800, 1600, 2400])}
            sizes="100vw"
            alt={shown.alt}
            className="lightbox-img"
          />
        )}
      </div>

      {images.length > 1 && shown && (
        <div className="lightbox-count" aria-live="polite">
          {(index ?? 0) + 1} / {images.length}
        </div>
      )}
    </div>,
    document.body,
  );
}
