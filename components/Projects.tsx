"use client";

import { useCallback, useState } from "react";
import { useReveal } from "../hooks/useReveal";
import { getProjectById, type Project } from "../lib/projects";
import ProjectModal from "./ProjectModal";

type ProjectsProps = {
  projects: Project[];
  heroImageUrl: string | null;
};

/** Project whose card image is supplied by the CMS rather than the repo. */
const HERO_IMAGE_PROJECT_ID = "vector-field";

export default function Projects({ projects, heroImageUrl }: ProjectsProps) {
  const sectionRef = useReveal<HTMLElement>();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const resolved = projects.map((p) =>
    p.id === HERO_IMAGE_PROJECT_ID && heroImageUrl
      ? { ...p, imageUrl: heroImageUrl }
      : p,
  );

  const vectorField = getProjectById(resolved, "vector-field");
  const parallelComputing = getProjectById(resolved, "parallel-computing");
  const exerciseTracker = getProjectById(resolved, "exercise-tracker");

  const expanded = expandedId ? getProjectById(resolved, expandedId) : null;

  const toggle = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));
  const close = useCallback(() => setExpandedId(null), []);

  return (
    <section
      className="projects-section section-pad"
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
            A selection of projects showcasing my work in data visualization,
            systems programming, high-performance computing, and full-stack
            development.
          </p>
        </div>

        <div className="bento">
          {/* ---- Card 1: Vector Field ---- */}
          {vectorField && (
            <div className="bento-1 reveal">
              <button
                type="button"
                className="card project-card project-card-button"
                onClick={() => toggle(vectorField.id)}
                aria-expanded={expandedId === vectorField.id}
                aria-controls="project-modal"
                aria-label={`Open case study: ${vectorField.title}`}
              >
                {vectorField.imageUrl && (
                  <div className="project-img-wrap">
                    <img src={vectorField.imageUrl} alt={vectorField.imageAlt} />
                    <div className="img-tags">
                      {vectorField.imageTags.map((t) => (
                        <span key={t} className="img-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="project-body">
                  <h3 className="h3">{vectorField.title}</h3>
                  <p>{vectorField.shortDescription}</p>
                  <div className="project-meta">
                    <span className="project-meta-item">
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "14px" }}
                        aria-hidden="true"
                      >
                        terminal
                      </span>{" "}
                      C++
                    </span>
                    <span className="project-meta-item">
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "14px" }}
                        aria-hidden="true"
                      >
                        query_stats
                      </span>{" "}
                      Real-time
                    </span>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* ---- Card 2: Parallel Computing ---- */}
          {parallelComputing && (
            <div className="bento-2 reveal reveal-delay-1">
              <button
                type="button"
                className="card project-card-icon project-card-button"
                onClick={() => toggle(parallelComputing.id)}
                aria-expanded={expandedId === parallelComputing.id}
                aria-controls="project-modal"
                aria-label={`Open case study: ${parallelComputing.title}`}
              >
                <div>
                  <div className="icon-chip">
                    <span className="material-symbols-outlined">memory</span>
                  </div>
                  <h3 className="h3" style={{ marginBottom: "12px" }}>
                    {parallelComputing.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.9rem",
                      lineHeight: 1.65,
                    }}
                  >
                    {parallelComputing.shortDescription}
                  </p>
                </div>
                <div className="perf-table">
                  <div className="perf-row">
                    <span className="perf-label">CUDA</span>
                    <span className="perf-value">10× Speedup</span>
                  </div>
                  <div className="perf-row">
                    <span className="perf-label">OpenMP</span>
                    <span className="perf-value">Multi-threaded</span>
                  </div>
                  <div className="perf-row">
                    <span className="perf-label">Monte Carlo</span>
                    <span className="perf-value">Optimized</span>
                  </div>
                </div>
              </button>
            </div>
          )}

          {/* ---- Card 3: Exercise Tracker ---- */}
          {exerciseTracker && (
            <div className="bento-3 reveal reveal-delay-2">
              <div className="card project-card project-card-wide">
                <div className="project-body">
                  <h3
                    className="h3"
                    style={{ fontSize: "1.6rem", marginBottom: "14px" }}
                  >
                    {exerciseTracker.title}
                  </h3>
                  <p>{exerciseTracker.shortDescription}</p>
                  <div className="tech-pills">
                    {exerciseTracker.technologies.slice(0, 4).map((t) => (
                      <span key={t} className="tech-pill">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="project-img-wrap" style={{ flex: "0 0 46%" }}>
                  <img
                    src={exerciseTracker.imageUrl ?? ""}
                    alt={exerciseTracker.imageAlt}
                  />
                </div>

                {/* The whole wide card opens the modal when clicked. An overlay
                    keeps its two-column layout intact — the card can't itself
                    be a button without restructuring it. */}
                <button
                  type="button"
                  className="project-card-wide-overlay"
                  onClick={() => toggle(exerciseTracker.id)}
                  aria-expanded={expandedId === exerciseTracker.id}
                  aria-controls="project-modal"
                  aria-label={`Open case study: ${exerciseTracker.title}`}
                />
              </div>
            </div>
          )}
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
