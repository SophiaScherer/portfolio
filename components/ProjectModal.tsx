"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useModal } from "../hooks/useModal";
import type { Project } from "../lib/projects";

type ProjectModalProps = {
  project: Project | null;
  open: boolean;
  onClose: () => void;
};

export default function ProjectModal({
  project,
  open,
  onClose,
}: ProjectModalProps) {
  const dialogRef = useModal<HTMLDivElement>({ open, onClose });

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

  if (!mounted) return null;

  // Rendered into <body> so the fixed overlay escapes the rounded, clipped
  // section wrappers it would otherwise be nested inside.
  return createPortal(
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
          <div className="card project-modal-card">
            <div className="project-modal-head">
              <div>
                <span className="label-cap">Case Study</span>
                <h3 className="h2 project-modal-title" id="project-modal-title">
                  {shown.title}
                </h3>
                <p className="project-modal-role">
                  <span className="material-symbols-outlined" aria-hidden="true">
                    person
                  </span>
                  {shown.role}
                </p>
              </div>
              <div className="project-modal-head-actions">
                {shown.githubUrl && (
                  <a
                    href={shown.githubUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn-primary project-modal-github"
                  >
                    <span
                      className="material-symbols-outlined"
                      aria-hidden="true"
                      style={{ fontSize: "18px" }}
                    >
                      code
                    </span>
                    GitHub
                    <span
                      className="material-symbols-outlined btn-icon"
                      aria-hidden="true"
                      style={{ fontSize: "16px" }}
                    >
                      arrow_outward
                    </span>
                  </a>
                )}
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
            </div>

            <div className="project-modal-body">
              <p className="project-modal-description">
                {shown.longDescription}
              </p>

              {shown.imageUrl && (
                <div className="project-modal-img-wrap">
                  <img src={shown.imageUrl} alt={shown.imageAlt} />
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
        <span
          className="material-symbols-outlined"
          aria-hidden="true"
          style={{ fontSize: "14px" }}
        >
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
