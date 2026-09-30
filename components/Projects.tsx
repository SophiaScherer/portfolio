"use client";

import { useCallback } from "react";
import { setLocationHash, useLocationHash } from "../hooks/useLocationHash";
import type { GalleryImage } from "../lib/content";
import { revealDelayClass } from "../lib/format";
import { currentOverlay, historyBack } from "../lib/history";
import { getProjectById, type Project } from "../lib/projects";
import ProjectCard, { BENTO_CLASS } from "./ProjectCard";
import ProjectModal from "./ProjectModal";

type ProjectsProps = {
  /** Projects with their CMS images already resolved — see `withCmsImages()`. */
  projects: Project[];
  /** Gallery images keyed by project id — see `getProjectGalleryMap()`. */
  projectGalleries: Record<string, GalleryImage[]>;
};

/** Each open case study has its own URL, e.g. `/#project-unpawse`. */
const HASH_PREFIX = "#project-";
const OVERLAY = "project";

export default function Projects({
  projects,
  projectGalleries,
}: ProjectsProps) {
  const hash = useLocationHash();

  const expanded = hash.startsWith(HASH_PREFIX)
    ? getProjectById(projects, hash.slice(HASH_PREFIX.length))
    : null;
  const expandedId = expanded?.id ?? null;

  const open = useCallback((id: string) => {
    setLocationHash(`${HASH_PREFIX}${id}`, { push: true, state: { overlay: OVERLAY } });
  }, []);

  // Opened from a card: step back off the entry it pushed. Arrived through a
  // shared link: there's no entry to pop, so just drop the hash.
  const close = useCallback(() => {
    if (currentOverlay() === OVERLAY) historyBack();
    else setLocationHash("");
  }, []);

  return (
    <section
      className="panel-section section-pad"
      id="projects"
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
          {projects.map((project, i) => (
            <div
              key={project.id}
              className={cellClass(project.cardVariant, i)}
            >
              <ProjectCard
                project={project}
                expanded={expandedId === project.id}
                onOpen={open}
              />
            </div>
          ))}
        </div>
      </div>

      <ProjectModal
        project={expanded}
        open={expanded !== null}
        onClose={close}
        galleries={projectGalleries}
      />
    </section>
  );
}

/** Grid cell plus the staggered reveal for this card's position. */
function cellClass(variant: Project["cardVariant"], index: number) {
  return `${BENTO_CLASS[variant]} reveal ${revealDelayClass(index)}`.trim();
}
