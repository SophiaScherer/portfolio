"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
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

/** A drag across a pinch-zoomed screenshot is someone reading it, not a swipe. */
const isZoomed = () => (window.visualViewport?.scale ?? 1) > 1.01;

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
  const swipeStart = useRef<{ id: number; x: number; y: number } | null>(null);
  // A swipe that ends on the backdrop would otherwise also count as a click.
  const swiped = useRef(false);

  // Held so the image and counter survive the close transition, then cleared
  // so a closed viewer doesn't load a full-size image. Clamped because the
  // gallery can shrink underneath a fading viewer.
  const [heldIndex, setHeldIndex] = useState(index);
  if (index !== null && index !== heldIndex) setHeldIndex(index);
  const shownIndex = heldIndex === null ? -1 : Math.min(heldIndex, images.length - 1);

  const hasNav = images.length > 1;
  const canNavigate = open && hasNav;
  const step = useCallback(
    (delta: number) => onNavigate(wrap(shownIndex + delta, images.length)),
    [shownIndex, images.length, onNavigate],
  );

  useEffect(() => {
    if (!canNavigate) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") step(1);
      else if (event.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [canNavigate, step]);

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType === "mouse") return;
    // A second finger makes this a pinch or a stray touch, not a swipe.
    swipeStart.current = event.isPrimary
      ? { id: event.pointerId, x: event.clientX, y: event.clientY }
      : null;
  };
  const onPointerUp = (event: PointerEvent) => {
    const start = swipeStart.current;
    swiped.current = false;
    if (!start || start.id !== event.pointerId) return;
    swipeStart.current = null;
    if (!canNavigate || isZoomed()) return;
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

  const shown = images[shownIndex] ?? null;

  // Rendered into <body> so it can layer above the case-study modal, which is
  // also a body-level portal. The whole layer is the dialog so `useModal`'s
  // focus trap reaches the controls, which sit outside the image's frame.
  return createPortal(
    <div
      className={`lightbox ${open ? "is-open" : ""}${hasNav ? " has-nav" : ""}`}
      aria-hidden={!open}
      // Stays visible through the fade-out; this takes the controls out of
      // reach the moment it starts.
      inert={!open}
      role="dialog"
      aria-modal="true"
      aria-label={shown?.alt || "Image viewer"}
      tabIndex={-1}
      ref={dialogRef}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => {
        swipeStart.current = null;
      }}
      onTransitionEnd={(event) => {
        if (!open && event.target === event.currentTarget && event.propertyName === "visibility") {
          setHeldIndex(null);
        }
      }}
    >
      <div className="lightbox-backdrop" onClick={onBackdropClick} aria-hidden="true" />

      <div className="lightbox-frame">
        {shown && (
          <img
            src={resizedImage(shown.url, 1600)}
            srcSet={imageSrcSet(shown.url, [800, 1600, 2400])}
            sizes="min(100vw, 1600px)"
            alt={shown.alt}
            className="lightbox-img"
          />
        )}
      </div>

      {/* After the frame so the controls paint above a wide image. */}
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

          {shown && (
            <div className="lightbox-count" aria-live="polite">
              {shownIndex + 1} / {images.length}
            </div>
          )}

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
