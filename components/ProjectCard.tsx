"use client";

import { imageSrcSet, resizedImage } from "../lib/images";
import type { Project } from "../lib/projects";

type ProjectCardProps = {
  project: Project;
  expanded: boolean;
  onOpen: (id: string) => void;
};

const CARD_WIDTHS = [480, 800, 1200];

/** Rendered image width: one card per row up to `lg`, the left column of a row
    card up to `xl`, then a third of the container. See `styles/_projects.scss`. */
const CARD_SIZES = "(max-width: 900px) 100vw, (max-width: 1150px) 35vw, 380px";

function CardImage({ project }: { project: Project }) {
  if (!project.imageUrl) {
    return <div className="project-img-placeholder" aria-hidden="true" />;
  }
  return (
    <img
      src={resizedImage(project.imageUrl, 800)}
      srcSet={imageSrcSet(project.imageUrl, CARD_WIDTHS)}
      sizes={CARD_SIZES}
      alt={project.imageAlt}
      loading="lazy"
      decoding="async"
    />
  );
}

/**
 * One project card. Every project renders the same layout; it opens the
 * case-study modal through a transparent button stretched over the card, so
 * the card's own content stays readable to assistive tech.
 */
export default function ProjectCard({
  project,
  expanded,
  onOpen,
}: ProjectCardProps) {
  return (
    <article className="card project-card">
      <div className="project-img-wrap">
        <CardImage project={project} />
        {project.imageUrl && project.imageTags.length > 0 && (
          <ul className="img-tags" role="list">
            {project.imageTags.map((t) => (
              <li key={t} className="img-tag">
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="project-body">
        <h3 className="h3">{project.title}</h3>
        <p>{project.shortDescription}</p>
      </div>
      {project.specs.length > 0 && (
        <dl className="spec-table">
          {/* Authored order, never reordered — index keys are stable here and
              survive duplicate labels. */}
          {project.specs.map((row, i) => (
            <div key={i} className="spec-row">
              <dt className="spec-label">{row.label}</dt>
              <dd className="spec-value">{row.value}</dd>
            </div>
          ))}
        </dl>
      )}
      <button
        type="button"
        className="project-card-trigger"
        onClick={() => onOpen(project.id)}
        aria-expanded={expanded}
        aria-controls="project-modal"
        aria-haspopup="dialog"
        aria-label={`Open case study: ${project.title}`}
      />
    </article>
  );
}
