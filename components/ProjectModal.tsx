"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useModal } from "../hooks/useModal";
import { useInView } from "../hooks/useInView";
import { useIsClient } from "../hooks/useIsClient";
import { useOverlayHistory } from "../hooks/useOverlayHistory";
import type { GalleryImage } from "../lib/content";
import { imageSrcSet, resizedImage } from "../lib/images";
import type { Project } from "../lib/projects";
import Lightbox, { type LightboxImage } from "./Lightbox";

type ProjectModalProps = {
  project: Project | null;
  open: boolean;
  onClose: () => void;
  /** Extra screenshots beyond the header image, keyed by project id. */
  galleries: Record<string, GalleryImage[]>;
};

const NO_GALLERY: GalleryImage[] = [];

export default function ProjectModal({
  project,
  open,
  onClose,
  galleries,
}: ProjectModalProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Keep the last project so the dialog still has content while it
  // transitions out, and close the lightbox whenever the dialog closes.
  const [shown, setShown] = useState<Project | null>(project);
  const [wasOpen, setWasOpen] = useState(open);
  if (project && project !== shown) setShown(project);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (!open) setLightboxIndex(null);
  }

  const closeLightbox = useOverlayHistory("lightbox", lightboxIndex !== null, () =>
    setLightboxIndex(null),
  );

  // The lightbox layers on top of this dialog and runs its own useModal
  // instance. Both listen on `document`, so leaving this one's Escape/Tab
  // handling active while the lightbox is open would double up Escape and
  // fight it for the Tab trap — `suspendKeyboard` hands the keyboard to the
  // lightbox without touching this dialog's own focus-restore target.
  const dialogRef = useModal<HTMLDivElement>({
    open,
    onClose,
    suspendKeyboard: lightboxIndex !== null,
  });

  // The scroll body is the observer root for the title, so the slim bar
  // condenses once the full title scrolls out of view.
  const [body, setBody] = useState<HTMLDivElement | null>(null);
  const [titleRef, titleInView] = useInView<HTMLHeadingElement>(body);

  // The dialog stays mounted between opens (and a URL change can swap the
  // project while open), so start each case study at the top.
  const shownId = shown?.id;
  useEffect(() => {
    if (open) body?.scrollTo(0, 0);
  }, [open, body, shownId]);

  const isClient = useIsClient();
  if (!isClient) return null;

  const gallery = shown ? (galleries[shown.id] ?? NO_GALLERY) : NO_GALLERY;
  // The header image is also the gallery's first thumbnail — without it,
  // reaching it again after scrolling down to the gallery would mean
  // scrolling all the way back up.
  const header: LightboxImage[] = shown?.imageUrl
    ? [{ url: shown.imageUrl, alt: shown.imageAlt || shown.title }]
    : [];
  // Numbered by position so the alt text matches the lightbox's "n / total".
  const allImages: LightboxImage[] = shown
    ? [
        ...header,
        ...gallery.map((image, i) => ({
          ...image,
          alt: `${shown.title} screenshot ${header.length + i + 1}`,
        })),
      ]
    : [];

  return (
    <>
      {/* Rendered into <body> so the fixed overlay escapes the rounded,
          clipped section wrappers it would otherwise be nested inside. */}
      {createPortal(
      <div
        className={`project-modal ${open ? "is-open" : ""}`}
        aria-hidden={!open}
      >
        <div
          className="project-modal-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
        <div
          className="project-modal-dialog"
          id="project-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          tabIndex={-1}
          ref={dialogRef}
        >
          {shown && (
            <div
              className={`card project-modal-card${titleInView ? "" : " is-condensed"}`}
            >
              <div className="project-modal-bar">
                {/* Visual repeat of the title for the condensed state; the
                    dialog is already labeled by the full heading. */}
                <span className="project-modal-bar-title" aria-hidden="true">
                  {shown.title}
                </span>
                <button
                  type="button"
                  className="project-modal-close"
                  onClick={onClose}
                  aria-label="Close case study"
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    close
                  </span>
                </button>
              </div>

              <div className="project-modal-body" ref={setBody}>
                <div className="project-modal-head">
                  <div>
                    <span className="label-cap">Case Study</span>
                    <h3
                      className="h2 project-modal-title"
                      id="project-modal-title"
                      ref={titleRef}
                    >
                      {shown.title}
                    </h3>
                    <p className="project-modal-role">
                      <span className="material-symbols-outlined" aria-hidden="true">
                        person
                      </span>
                      {shown.role}
                    </p>
                  </div>
                  {shown.githubUrl && (
                    <a
                      href={shown.githubUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="btn-primary project-modal-github"
                    >
                      <span className="material-symbols-outlined" aria-hidden="true">
                        code
                      </span>
                      GitHub
                      <span
                        className="material-symbols-outlined btn-icon"
                        aria-hidden="true"
                      >
                        arrow_outward
                      </span>
                    </a>
                  )}
                </div>

                {shown.imageUrl && (
                  <button
                    type="button"
                    className="project-modal-img-wrap"
                    onClick={() => setLightboxIndex(0)}
                    aria-label={`View larger: ${shown.title}`}
                  >
                    <img
                      src={resizedImage(shown.imageUrl, 1200)}
                      srcSet={imageSrcSet(shown.imageUrl, [800, 1200, 1800])}
                      sizes="(max-width: 1000px) 100vw, 880px"
                      alt={shown.imageAlt}
                      decoding="async"
                    />
                  </button>
                )}

                <p className="project-modal-description">
                  {shown.longDescription}
                </p>

                <div className="project-modal-meta">
                  <MetaBlock
                    label="Languages"
                    items={shown.languages}
                    icon="terminal"
                  />
                  <MetaBlock
                    label="Technologies"
                    items={shown.technologies}
                    icon="layers"
                  />
                </div>

                <div className="project-modal-cols">
                  <div>
                    <h4 className="project-modal-h4">Technical Details</h4>
                    <ul className="project-modal-list">
                      {shown.technicalDetails.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="project-modal-h4">Key Features</h4>
                    <ul className="project-modal-list project-modal-list-features">
                      {shown.keyFeatures.map((f) => (
                        <li key={f}>
                          <span
                            className="material-symbols-outlined"
                            aria-hidden="true"
                          >
                            check_circle
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="project-modal-case">
                  <h4 className="project-modal-h4">{shown.caseStudy.label}</h4>
                  {shown.caseStudy.body.map((para, i) => (
                    <p key={i} className="project-modal-case-body">
                      {para}
                    </p>
                  ))}
                </div>

                {allImages.length > 0 && (
                  <div className="project-modal-gallery">
                    <h4 className="project-modal-h4">Gallery</h4>
                    <div className="project-modal-gallery-track">
                      {allImages.map((img, i) => (
                        <button
                          key={img.url}
                          type="button"
                          className="project-modal-gallery-thumb"
                          onClick={() => setLightboxIndex(i)}
                          aria-label={`View image ${i + 1} of ${allImages.length}`}
                        >
                          <img
                            src={resizedImage(img.url, 520)}
                            alt={img.alt}
                            width={img.width ?? undefined}
                            height={img.height ?? undefined}
                            loading="lazy"
                            decoding="async"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>,
      document.body,
      )}
      <Lightbox
        images={allImages}
        index={lightboxIndex}
        onClose={closeLightbox}
        onNavigate={setLightboxIndex}
      />
    </>
  );
}

function MetaBlock({
  label,
  items,
  icon,
}: {
  label: string;
  items: string[];
  icon: string;
}) {
  return (
    <div className="project-modal-meta-block">
      <span className="project-modal-meta-label">
        <span className="material-symbols-outlined" aria-hidden="true">
          {icon}
        </span>
        {label}
      </span>
      <div className="project-modal-meta-pills">
        {items.map((it) => (
          <span key={it} className="project-modal-pill">
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}
