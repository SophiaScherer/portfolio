"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!open || images.length < 2) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        onNavigate(((index ?? 0) + 1) % images.length);
      } else if (event.key === "ArrowLeft") {
        onNavigate(((index ?? 0) - 1 + images.length) % images.length);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, index, images.length, onNavigate]);

  if (!mounted) return null;

  const shown = index !== null ? images[index] : null;
  const goPrev = () => onNavigate(((index ?? 0) - 1 + images.length) % images.length);
  const goNext = () => onNavigate(((index ?? 0) + 1) % images.length);

  // Rendered into <body> so it can layer above the case-study modal, which is
  // also a body-level portal.
  return createPortal(
    <div className={`lightbox ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <div className="lightbox-backdrop" onClick={onClose} aria-hidden="true" />

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
            onClick={goPrev}
            aria-label="Previous image"
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              chevron_left
            </span>
          </button>
          <button
            type="button"
            className="lightbox-nav lightbox-next"
            onClick={goNext}
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
        {shown && <img src={shown.url} alt={shown.alt} className="lightbox-img" />}
      </div>

      {images.length > 1 && shown && (
        <div className="lightbox-count">
          {(index ?? 0) + 1} / {images.length}
        </div>
      )}
    </div>,
    document.body,
  );
}
