"use client";

import { useEffect, useState } from "react";
import { useReveal } from "../hooks/useReveal";

type ProjectsProps = {
  heroImageUrl: string | null;
};

type Tech = string;

type Project = {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  githubUrl: string;
  role: string;
  languages: Tech[];
  technologies: Tech[];
  technicalDetails: string[];
  keyFeatures: string[];
  imageUrl: string | null;
  imageAlt: string;
  imageTags: string[];
  caseStudy: {
    label: "Project Overview" | "Challenges & Solutions";
    body: string[];
  };
};

const PROJECTS: Project[] = [
  {
    id: "vector-field",
    title: "2D Vector Field Visualization",
    shortDescription:
      "Interactive OpenGL system for visualizing vector and scalar fields. Features real-time GLSL Line Integral Convolution (LIC) and streamline tracing for fluid flow analysis.",
    longDescription:
      "An interactive GPU-accelerated visualization tool that renders vector and scalar fields in real time. Built from scratch in C++ with OpenGL and GLSL shaders, the application supports Line Integral Convolution for dense flow textures and streamline tracing for individual particle paths — making it suitable for analyzing fluid dynamics, electromagnetic fields, and other continuous systems.",
    githubUrl: "https://github.com/SophiaScherer/2d-vector-field-visualization",
    role: "Sole Developer",
    languages: ["C++", "GLSL"],
    technologies: ["OpenGL", "GLFW", "GLM", "Dear ImGui"],
    technicalDetails: [
      "Implemented custom fragment shaders for Line Integral Convolution with configurable noise textures and convolution kernel lengths",
      "Designed a streamline integrator using 4th-order Runge-Kutta for stable particle advection through complex fields",
      "Built a real-time UI for adjusting field parameters, color maps, and visualization modes",
    ],
    keyFeatures: [
      "Real-time GLSL LIC rendering",
      "RK4 streamline tracing",
      "Interactive parameter tuning",
      "Multiple color map presets",
    ],
    imageUrl: null,
    imageAlt: "2D Vector Field Visualization",
    imageTags: ["OpenGL", "GLSL"],
    caseStudy: {
      label: "Project Overview",
      body: [
        "The goal was to build a visualization environment that could handle arbitrary 2D vector and scalar fields while remaining responsive at interactive frame rates.",
        "By moving the heavy texture convolution to the GPU and using ping-pong framebuffers, the renderer sustains 60fps even on dense fields. The desktop UI wraps the rendering surface in Dear ImGui so analysts can tweak field sources, color maps, and visualization modes without recompiling.",
      ],
    },
  },
  {
    id: "parallel-computing",
    title: "High-Performance Parallel Computing",
    shortDescription:
      "Benchmarked and optimized parallel algorithms using CUDA and OpenMP. Measured performance and analyzed speedup across Monte Carlo simulations.",
    longDescription:
      "A focused study of parallel algorithm performance across CUDA and OpenMP runtimes. Implemented Monte Carlo simulations and other embarrassingly-parallel workloads, then measured real-world speedup, memory bandwidth, and thread occupancy to characterize where each paradigm excels.",
    githubUrl: "https://github.com/SophiaScherer/parallel-computing-benchmarks",
    role: "Researcher & Implementer",
    languages: ["C", "C++", "CUDA"],
    technologies: ["CUDA", "OpenMP", "NVIDIA Nsight", "gprof"],
    technicalDetails: [
      "Wrote CUDA kernels with shared memory tiling and occupancy tuning for Monte Carlo price simulation",
      "Built OpenMP counterparts using #pragma parallel for with proper reduction clauses",
      "Profiled each implementation with NVIDIA Nsight and gprof to identify memory-bound vs compute-bound bottlenecks",
    ],
    keyFeatures: [
      "CUDA + OpenMP benchmark suite",
      "Memory-bound bottleneck analysis",
      "Speedup / efficiency reporting",
      "Reproducible test harness",
    ],
    imageUrl: null,
    imageAlt: "",
    imageTags: ["CUDA", "OpenMP"],
    caseStudy: {
      label: "Challenges & Solutions",
      body: [
        "Challenge: achieving consistent double-digit speedup on memory-bound kernels. Solution: coalesced memory access patterns and shared-memory tiling reduced global memory pressure and lifted the CUDA kernel from 4× to 10× speedup over a sequential baseline.",
        "Challenge: ensuring statistical correctness as thread counts scaled. Solution: used per-thread RNG streams with a leapfrog generator so results remained reproducible regardless of block configuration.",
      ],
    },
  },
  {
    id: "exercise-tracker",
    title: "Full-Stack Exercise Tracker",
    shortDescription:
      "A comprehensive fitness companion built with React and MongoDB. Developed a RESTful API for persistent workout tracking and real-time data management.",
    longDescription:
      "A full-stack fitness tracking application that lets users log workouts, monitor progress over time, and visualize training volume. The backend exposes a RESTful API for persistent storage while the React frontend delivers an immediate, responsive UI for everyday use.",
    githubUrl: "https://github.com/SophiaScherer/exercise-tracker",
    role: "Full-Stack Developer",
    languages: ["JavaScript", "TypeScript"],
    technologies: ["React", "Node.js", "Express", "MongoDB", "REST API"],
    technicalDetails: [
      "Designed a normalized MongoDB schema for users, exercises, and sessions with proper indexing on common query paths",
      "Implemented Express middleware for request validation and centralized error handling",
      "Built a React frontend with optimistic updates so the UI feels immediate even on slow networks",
    ],
    keyFeatures: [
      "Workout session logging",
      "Progress charts over time",
      "RESTful CRUD API",
      "Persistent user accounts",
    ],
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC8Mt2vZn-6mCyo5Uhkufjag__v6HsmD-YxY5KRXxOgZo6KVrgx6di82-LjT6TJBBjFOmTX9roGY0-hSS68a0_lEzmVZvKIvOkR2zFxjEqcnBXhpmcApGe7RCCRIUw2zCiTPXA-tqZdQj60UXG9qVaYt-5siXNklF0yOJWbBMFL72HedvH8UsNb_rFjk_xZdZ9HUHgm8QL9GViX_PVmgsmzHnQiZJe_ZxzO-3Ging8C76458-ZQgNAMqJZX2kwbjoa9iCxm6TPOEZw",
    imageAlt: "Exercise Tracker Interface",
    imageTags: ["React", "Node.js"],
    caseStudy: {
      label: "Project Overview",
      body: [
        "The app was designed to remove friction from logging sets and reps during a workout. Sessions can be created in a few taps and later revisited to chart progression on a per-exercise basis.",
        "On the server side, every resource is exposed through a clean REST surface with consistent error envelopes. The frontend uses React state with optimistic mutations so the UI updates immediately while the request is in flight — and rolls back cleanly if the server rejects it.",
      ],
    },
  },
];

export default function Projects({ heroImageUrl }: ProjectsProps) {
  const sectionRef = useReveal<HTMLElement>();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const projects = PROJECTS.map((p, i) =>
    i === 0 && heroImageUrl ? { ...p, imageUrl: heroImageUrl } : p,
  );

  const expanded = expandedId
    ? projects.find((p) => p.id === expandedId) ?? null
    : null;

  // Lock body scroll while the modal is open.
  useEffect(() => {
    if (!expandedId) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [expandedId]);

  // Escape closes the modal.
  useEffect(() => {
    if (!expandedId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpandedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expandedId]);

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

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
            development. Tap any card for the full case study.
          </p>
        </div>

        <div className="bento">
          {/* ---- Card 1: Vector Field ---- */}
          <div className="bento-1 reveal">
            <button
              type="button"
              className="card project-card project-card-button"
              onClick={() => toggle("vector-field")}
              aria-expanded={expandedId === "vector-field"}
              aria-controls="project-modal"
              aria-label={`Open case study: ${projects[0].title}`}
            >
              {projects[0].imageUrl && (
                <div className="project-img-wrap">
                  <img src={projects[0].imageUrl} alt={projects[0].imageAlt} />
                  <div className="img-tags">
                    {projects[0].imageTags.map((t) => (
                      <span key={t} className="img-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="project-body">
                <h3 className="h3">{projects[0].title}</h3>
                <p>{projects[0].shortDescription}</p>
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

          {/* ---- Card 2: Parallel Computing ---- */}
          <div className="bento-2 reveal reveal-delay-1">
            <button
              type="button"
              className="card project-card-icon project-card-button"
              onClick={() => toggle("parallel-computing")}
              aria-expanded={expandedId === "parallel-computing"}
              aria-controls="project-modal"
              aria-label={`Open case study: ${projects[1].title}`}
            >
              <div>
                <div className="icon-chip">
                  <span className="material-symbols-outlined">memory</span>
                </div>
                <h3 className="h3" style={{ marginBottom: "12px" }}>
                  {projects[1].title}
                </h3>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.9rem",
                    lineHeight: 1.65,
                  }}
                >
                  {projects[1].shortDescription}
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

          {/* ---- Card 3: Exercise Tracker ---- */}
          <div className="bento-3 reveal reveal-delay-2">
            <div className="card project-card project-card-wide">
              <div className="project-body">
                <h3
                  className="h3"
                  style={{ fontSize: "1.6rem", marginBottom: "14px" }}
                >
                  {projects[2].title}
                </h3>
                <p>{projects[2].shortDescription}</p>
                <div className="tech-pills">
                  {projects[2].technologies.slice(0, 4).map((t) => (
                    <span key={t} className="tech-pill">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="project-img-wrap" style={{ flex: "0 0 46%" }}>
                <img
                  src={projects[2].imageUrl ?? ""}
                  alt={projects[2].imageAlt}
                />
              </div>
              {/* The whole wide card opens the modal when clicked. */}
              <button
                type="button"
                className="project-card-wide-overlay"
                onClick={() => toggle("exercise-tracker")}
                aria-expanded={expandedId === "exercise-tracker"}
                aria-controls="project-modal"
                aria-label={`Open case study: ${projects[2].title}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ---- Modal ---- */}
      <ProjectModal
        project={expanded}
        open={expanded !== null}
        onClose={() => setExpandedId(null)}
      />
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Modal                                                                       */
/* -------------------------------------------------------------------------- */

function ProjectModal({
  project,
  open,
  onClose,
}: {
  project: Project | null;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={`project-modal ${open ? "is-open" : ""}`}
      id="project-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      aria-hidden={!open}
    >
      <div
        className="project-modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="project-modal-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {project && (
          <div className="card project-modal-card">
            <div className="project-modal-head">
              <div>
                <span className="label-cap">Case Study</span>
                <h3
                  className="h2 project-modal-title"
                  id="project-modal-title"
                >
                  {project.title}
                </h3>
                <p className="project-modal-role">
                  <span
                    className="material-symbols-outlined"
                    aria-hidden="true"
                  >
                    person
                  </span>
                  {project.role}
                </p>
              </div>
              <div className="project-modal-head-actions">
                <a
                  href={project.githubUrl}
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
                {project.longDescription}
              </p>

              {project.imageUrl && (
                <div className="project-modal-img-wrap">
                  <img src={project.imageUrl} alt={project.imageAlt} />
                </div>
              )}

              <div className="project-modal-meta">
                <MetaBlock
                  label="Languages"
                  items={project.languages}
                  icon="terminal"
                />
                <MetaBlock
                  label="Technologies"
                  items={project.technologies}
                  icon="layers"
                />
              </div>

              <div className="project-modal-cols">
                <div>
                  <h4 className="project-modal-h4">Technical Details</h4>
                  <ul className="project-modal-list">
                    {project.technicalDetails.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="project-modal-h4">Key Features</h4>
                  <ul className="project-modal-list project-modal-list-features">
                    {project.keyFeatures.map((f) => (
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
                <h4 className="project-modal-h4">{project.caseStudy.label}</h4>
                {project.caseStudy.body.map((para, i) => (
                  <p key={i} className="project-modal-case-body">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
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