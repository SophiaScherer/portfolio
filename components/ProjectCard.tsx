"use client";

import { imageSrcSet, resizedImage } from "../lib/images";
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

const CARD_WIDTHS = [480, 800, 1200];

/** Rendered width of each variant's image at desktop sizes. */
const CARD_SIZES: Record<CardVariant, string> = {
  image: "(max-width: 900px) 100vw, 680px",
  icon: "(max-width: 900px) 100vw, 460px",
  wide: "(max-width: 900px) 100vw, 560px",
};

function CardImage({ project }: { project: Project }) {
  if (!project.imageUrl) {
    return <div className="project-img-placeholder" aria-hidden="true" />;
  }
  return (
    <img
      src={resizedImage(project.imageUrl, 800)}
      srcSet={imageSrcSet(project.imageUrl, CARD_WIDTHS)}
      sizes={CARD_SIZES[project.cardVariant]}
      alt={project.imageAlt}
      loading="lazy"
      decoding="async"
    />
  );
}

/**
 * One project card. The variant picks the layout; every variant opens the same
 * case-study modal through a transparent button stretched over the card, so
 * the card's own content stays readable to assistive tech.
 */
export default function ProjectCard({
  project,
  expanded,
  onToggle,
}: ProjectCardProps) {
  const trigger = (
    <button
      type="button"
      className="project-card-trigger"
      onClick={() => onToggle(project.id)}
      aria-expanded={expanded}
      aria-controls="project-modal"
      aria-haspopup="dialog"
      aria-label={`Open case study: ${project.title}`}
    />
  );

  if (project.cardVariant === "icon") {
    return (
      <article className="card project-card-icon">
        <div>
          {/* An image is the stronger identity — the generic icon only
              stands in for a project that doesn't have one yet. */}
          {project.imageUrl ? (
            <div className="project-card-icon-img-wrap">
              <CardImage project={project} />
            </div>
          ) : (
            project.cardIcon && (
              <div className="icon-chip" aria-hidden="true">
                <span className="material-symbols-outlined">
                  {project.cardIcon}
                </span>
              </div>
            )
          )}
          <h3 className="h3">{project.title}</h3>
          <p>{project.shortDescription}</p>
        </div>
        {project.perfRows.length > 0 && (
          <dl className="perf-table">
            {/* Authored order, never reordered — index keys are stable here and
                survive duplicate labels. */}
            {project.perfRows.map((row, i) => (
              <div key={i} className="perf-row">
                <dt className="perf-label">{row.label}</dt>
                <dd className="perf-value">{row.value}</dd>
              </div>
            ))}
          </dl>
        )}
        {trigger}
      </article>
    );
  }

  if (project.cardVariant === "wide") {
    return (
      <article className="card project-card project-card-wide">
        <div className="project-body">
          <h3 className="h3">{project.title}</h3>
          <p>{project.shortDescription}</p>
          <ul className="tech-pills">
            {project.technologies.slice(0, 4).map((t) => (
              <li key={t} className="tech-pill">
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="project-img-wrap">
          <CardImage project={project} />
        </div>
        {trigger}
      </article>
    );
  }

  return (
    <article className="card project-card project-card-image">
      <div className="project-img-wrap">
        <CardImage project={project} />
        {project.imageUrl && project.imageTags.length > 0 && (
          <ul className="img-tags">
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
      {trigger}
    </article>
  );
}
