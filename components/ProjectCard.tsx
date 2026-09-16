"use client";

import type { CardVariant, Project } from "../lib/projects";

type ProjectCardProps = {
  project: Project;
  expanded: boolean;
  onToggle: (id: string) => void;
};

/**
 * Grid cell each variant occupies. The bento is a fixed 12-column row, so the
 * spans have to add up — see `styles/_projects.scss`.
 */
export const BENTO_CLASS: Record<CardVariant, string> = {
  image: "bento-1",
  icon: "bento-2",
  wide: "bento-3",
};

/**
 * One project card. The variant picks the layout; every variant opens the same
 * case-study modal, so the button wiring is shared.
 */
export default function ProjectCard({
  project,
  expanded,
  onToggle,
}: ProjectCardProps) {
  // Every variant's click target carries the same modal wiring.
  const trigger = {
    type: "button" as const,
    onClick: () => onToggle(project.id),
    "aria-expanded": expanded,
    "aria-controls": "project-modal",
    "aria-label": `Open case study: ${project.title}`,
  };

  if (project.cardVariant === "icon") {
    return (
      <button {...trigger} className="card project-card-icon project-card-button">
        <div>
          {project.cardIcon && (
            <div className="icon-chip">
              <span className="material-symbols-outlined">
                {project.cardIcon}
              </span>
            </div>
          )}
          <h3 className="h3">{project.title}</h3>
          <p>{project.shortDescription}</p>
        </div>
        {project.perfRows.length > 0 && (
          <div className="perf-table">
            {/* Authored order, never reordered — index keys are stable here and
                survive duplicate labels. */}
            {project.perfRows.map((row, i) => (
              <div key={i} className="perf-row">
                <span className="perf-label">{row.label}</span>
                <span className="perf-value">{row.value}</span>
              </div>
            ))}
          </div>
        )}
      </button>
    );
  }

  if (project.cardVariant === "wide") {
    return (
      <div className="card project-card project-card-wide">
        <div className="project-body">
          <h3 className="h3">{project.title}</h3>
          <p>{project.shortDescription}</p>
          <div className="tech-pills">
            {project.technologies.slice(0, 4).map((t) => (
              <span key={t} className="tech-pill">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="project-img-wrap">
          {project.imageUrl ? (
            <img src={project.imageUrl} alt={project.imageAlt} />
          ) : (
            <div className="project-img-placeholder">
              <span>app screenshot / GIF</span>
            </div>
          )}
        </div>

        {/* The whole wide card opens the modal when clicked. An overlay
            keeps its two-column layout intact — the card can't itself
            be a button without restructuring it. */}
        <button {...trigger} className="project-card-wide-overlay" />
      </div>
    );
  }

  return (
    <button {...trigger} className="card project-card project-card-button">
      {project.imageUrl && (
        <div className="project-img-wrap">
          <img src={project.imageUrl} alt={project.imageAlt} />
          <div className="img-tags">
            {project.imageTags.map((t) => (
              <span key={t} className="img-tag">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="project-body">
        <h3 className="h3">{project.title}</h3>
        <p>{project.shortDescription}</p>
        {project.cardMeta.length > 0 && (
          <div className="project-meta">
            {project.cardMeta.map((m, i) => (
              <span key={i} className="project-meta-item">
                <span className="material-symbols-outlined" aria-hidden="true">
                  {m.icon}
                </span>{" "}
                {m.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}
