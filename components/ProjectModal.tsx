"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useModal } from "../hooks/useModal";
import { useInView } from "../hooks/useInView";
import type { Project } from "../lib/projects";
import Lightbox, { type LightboxImage } from "./Lightbox";

type ProjectModalProps = {
  project: Project | null;
  open: boolean;
  onClose: () => void;
  /** Extra screenshots beyond the header image — see `getProjectGalleryMap`. */
  galleryImages: LightboxImage[];
};

export default function ProjectModal({
  project,
  open,
  onClose,
  galleryImages,
}: ProjectModalProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

  useEffect(() => {
    if (!open) setLightboxIndex(null);
  }, [open]);

  // The scroll body is the observer root for the title, so the slim bar
  // condenses once the full title scrolls out of view.
  const [body, setBody] = useState<HTMLDivElement | null>(null);
  const [titleRef, titleInView] = useInView<HTMLHeadingElement>(body);

  // The dialog stays mounted between opens, so start each case study at the top.
  useEffect(() => {
    if (open && body) body.scrollTop = 0;
  }, [open, body]);

  // Portals need a DOM node to target, which doesn't exist while rendering on
  // the server.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Hold on to the last project so the card still has content to show while the
  // dialog transitions out — otherwise it empties a beat before the backdrop
  // finishes fading.
  const lastProject = useRef<Project | null>(null);
  useEffect(() => {
    if (project) lastProject.current = project;
  }, [project]);
  const shown = project ?? lastProject.current;

  // The lightbox's sequence is the header image (if any) followed by the
  // gallery, so opening the header and arrowing forward flows straight into
  // the gallery images.
  const allImages: LightboxImage[] = shown?.imageUrl
    ? [{ url: shown.imageUrl, alt: shown.imageAlt || shown.title }, ...galleryImages]
    : galleryImages;
  const galleryOffset = shown?.imageUrl ? 1 : 0;

  if (!mounted) return null;

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
                    dialog is already labelled by the full heading. */}
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

                <p className="project-modal-description">
                  {shown.longDescription}
                </p>

                {shown.imageUrl && (
                  <button
                    type="button"
                    className="project-modal-img-wrap"
                    onClick={() => setLightboxIndex(0)}
                    aria-label={`View larger: ${shown.title}`}
                  >
                    <img src={shown.imageUrl} alt={shown.imageAlt} />
                  </button>
                )}

                {galleryImages.length > 0 && (
                  <div className="project-modal-gallery">
                    <h4 className="project-modal-h4">Gallery</h4>
                    <div className="project-modal-gallery-track">
                      {galleryImages.map((img, i) => (
                        <button
                          key={img.url}
                          type="button"
                          className="project-modal-gallery-thumb"
                          onClick={() => setLightboxIndex(galleryOffset + i)}
                          aria-label={`View image ${galleryOffset + i + 1} of ${allImages.length}`}
                        >
                          <img src={img.url} alt={img.alt} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

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
        onClose={() => setLightboxIndex(null)}
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
