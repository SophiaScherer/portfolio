"use client";

import { useCallback, useState } from "react";
import { useReveal } from "../hooks/useReveal";
import { getProjectById, type Project } from "../lib/projects";
import ProjectCard, { BENTO_CLASS } from "./ProjectCard";
import ProjectModal from "./ProjectModal";

type ProjectsProps = {
  projects: Project[];
  heroImageUrl: string | null;
};

/** Project whose card image is supplied by the CMS rather than the repo. */
const HERO_IMAGE_PROJECT_ID = "vector-field";

/** `_animations.scss` only defines `.reveal-delay-1` through `-4`. */
const MAX_REVEAL_DELAY = 4;

export default function Projects({ projects, heroImageUrl }: ProjectsProps) {
  const sectionRef = useReveal<HTMLElement>();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const resolved = projects.map((p) =>
    p.id === HERO_IMAGE_PROJECT_ID && heroImageUrl
      ? { ...p, imageUrl: heroImageUrl }
      : p,
  );

  warnOnDuplicateVariants(resolved);

  const expanded = expandedId ? getProjectById(resolved, expandedId) : null;

  const toggle = useCallback(
    (id: string) => setExpandedId((prev) => (prev === id ? null : id)),
    [],
  );
  const close = useCallback(() => setExpandedId(null), []);

  return (
    <section
      className="panel-section section-pad"
      id="projects"
      ref={sectionRef}
    >
      <div className="container">
        <div className="projects-header">
          <div>
            <span className="label-cap reveal">Portfolio</span>
            <h2 className="h2 reveal reveal-delay-1">Personal Projects</h2>
          </div>
          <p className="reveal reveal-delay-2">
            A selection of projects showcasing my work in desktop systems
            programming, mobile development, on-device machine learning, and
            real-time data visualization.
          </p>
        </div>

        <div className="bento">
          {resolved.map((project, i) => (
            <div
              key={project.id}
              className={cellClass(project.cardVariant, i)}
            >
              <ProjectCard
                project={project}
                expanded={expandedId === project.id}
                onToggle={toggle}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ---- Modal ---- */}
      <ProjectModal
        project={expanded}
        open={expanded !== null}
        onClose={close}
      />
    </section>
  );
}

/**
 * The bento is one fixed 12-column row and each variant owns a different span,
 * so two projects sharing a variant overflow it. Nothing in the type system
 * enforces distinctness, so say so loudly in development.
 */
function warnOnDuplicateVariants(projects: Project[]) {
  if (process.env.NODE_ENV === "production") return;
  const seen = new Set<string>();
  for (const p of projects) {
    if (seen.has(p.cardVariant)) {
      console.warn(
        `[Projects] Duplicate cardVariant "${p.cardVariant}" on "${p.id}" — the bento row will not add up to 12 columns.`,
      );
    }
    seen.add(p.cardVariant);
  }
}

/** Grid cell plus the staggered reveal for this card's position. */
function cellClass(variant: Project["cardVariant"], index: number) {
  const delay =
    index > 0 ? ` reveal-delay-${Math.min(index, MAX_REVEAL_DELAY)}` : "";
  return `${BENTO_CLASS[variant]} reveal${delay}`;
}
