"use client";

import { useCallback } from "react";
import { setLocationHash, useLocationHash } from "../hooks/useLocationHash";
import { useReveal } from "../hooks/useReveal";
import type { GalleryImage } from "../lib/content";
import { getProjectById, type Project } from "../lib/projects";
import ProjectCard, { BENTO_CLASS } from "./ProjectCard";
import ProjectModal from "./ProjectModal";

type ProjectsProps = {
  /** Projects with their CMS images already resolved — see `withCmsImages()`. */
  projects: Project[];
  /** Gallery images keyed by project id — see `getProjectGalleryMap()`. */
  projectGalleries: Record<string, GalleryImage[]>;
};

/** `_animations.scss` only defines `.reveal-delay-1` through `-4`. */
const MAX_REVEAL_DELAY = 4;

/** Each open case study has its own URL, e.g. `/#project-unpawse`. */
const HASH_PREFIX = "#project-";
const OPENED_FROM_PAGE = { overlay: "project" };

export default function Projects({
  projects,
  projectGalleries,
}: ProjectsProps) {
  const sectionRef = useReveal<HTMLElement>();
  const hash = useLocationHash();

  const expanded = hash.startsWith(HASH_PREFIX)
    ? getProjectById(projects, hash.slice(HASH_PREFIX.length))
    : null;
  const expandedId = expanded?.id ?? null;

  const open = useCallback((id: string) => {
    setLocationHash(`${HASH_PREFIX}${id}`, { push: true, state: OPENED_FROM_PAGE });
  }, []);

  // Opened from a card: step back off the entry it pushed. Arrived through a
  // shared link: there's no entry to pop, so just drop the hash.
  const close = useCallback(() => {
    if ((window.history.state as typeof OPENED_FROM_PAGE | null)?.overlay === "project") {
      window.history.back();
    } else {
      setLocationHash("");
    }
  }, []);

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
  const delay =
    index > 0 ? ` reveal-delay-${Math.min(index, MAX_REVEAL_DELAY)}` : "";
  return `${BENTO_CLASS[variant]} reveal${delay}`;
}
