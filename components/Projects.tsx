"use client";

import { useCallback, useState } from "react";
import { useReveal } from "../hooks/useReveal";
import type { GalleryImage } from "../lib/content";
import { getProjectById, type Project } from "../lib/projects";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";

type ProjectsProps = {
  projects: Project[];
  /** Published CMS images keyed by file name — see `getProjectImageMap()`. */
  projectImages: Record<string, string>;
  /** Gallery images keyed by project id — see `getProjectGalleryMap()`. */
  projectGalleries: Record<string, GalleryImage[]>;
};

/** `_animations.scss` only defines `.reveal-delay-1` through `-4`. */
const MAX_REVEAL_DELAY = 4;
const NO_GALLERY: GalleryImage[] = [];

export default function Projects({
  projects,
  projectImages,
  projectGalleries,
}: ProjectsProps) {
  const sectionRef = useReveal<HTMLElement>();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // A project claims its CMS asset by name. An unpublished name misses the
  // lookup and the card keeps its own `imageUrl` (usually null → placeholder).
  const resolved = projects.map((p) => {
    const url = p.cmsImageFileName
      ? projectImages[p.cmsImageFileName]
      : undefined;
    return url ? { ...p, imageUrl: url } : p;
  });

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

        <div className="projects-grid">
          {resolved.map((project, i) => (
            <div key={project.id} className={cellClass(i)}>
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
        galleryImages={
          expandedId ? (projectGalleries[expandedId] ?? NO_GALLERY) : NO_GALLERY
        }
      />
    </section>
  );
}

/** Staggered reveal for this card's position in the grid. */
function cellClass(index: number) {
  const delay =
    index > 0 ? ` reveal-delay-${Math.min(index, MAX_REVEAL_DELAY)}` : "";
  return `reveal${delay}`;
}
