"use client";

import type { Project } from "../lib/projects";

type ProjectCardProps = {
  project: Project;
  expanded: boolean;
  onToggle: (id: string) => void;
};

/** Stands in for a card image that hasn't been published to the CMS yet. */
function ImagePlaceholder() {
  return (
    <div className="project-img-placeholder">
      <span>app screenshot / GIF</span>
    </div>
  );
}

/**
 * One project card. Every project renders this same layout — inset image with
 * its tags, title, description, then the spec table pinned to the card's
 * bottom edge so the rows line up across the grid row.
 */
export default function ProjectCard({
  project,
  expanded,
  onToggle,
}: ProjectCardProps) {
  return (
    <button
      type="button"
      className="card project-card"
      onClick={() => onToggle(project.id)}
      aria-expanded={expanded}
      aria-controls="project-modal"
      aria-label={`Open case study: ${project.title}`}
    >
      <div className="project-card-main">
        <div className="project-img-wrap">
          {project.imageUrl ? (
            <>
              <img src={project.imageUrl} alt={project.imageAlt} />
              {project.imageTags.length > 0 && (
                <div className="img-tags">
                  {project.imageTags.map((t) => (
                    <span key={t} className="img-tag">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </>
          ) : (
            <ImagePlaceholder />
          )}
        </div>
        <h3 className="h3">{project.title}</h3>
        <p>{project.shortDescription}</p>
      </div>

      {project.specs.length > 0 && (
        <div className="project-specs">
          {/* Authored order, never reordered — index keys are stable here and
              survive duplicate labels. */}
          {project.specs.map((row, i) => (
            <div key={i} className="project-spec-row">
              <span className="project-spec-label">{row.label}</span>
              <span className="project-spec-value">{row.value}</span>
            </div>
          ))}
        </div>
      )}
    </button>
  );
}
