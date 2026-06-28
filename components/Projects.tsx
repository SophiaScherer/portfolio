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

  technologies: Tech[];

  imageUrl: string | null;
  imageAlt: string;
  imageTags: string[];

};

const PROJECTS: Project[] = [
  {
    id: "vector-field",
    title: "2D Vector Field Visualization",
    shortDescription:
      "Interactive OpenGL system for visualizing vector and scalar fields. Features real-time GLSL Line Integral Convolution (LIC) and streamline tracing for fluid flow analysis.",

    technologies: ["OpenGL", "GLFW", "GLM", "Dear ImGui"],

    imageUrl: null,
    imageAlt: "2D Vector Field Visualization",
    imageTags: ["OpenGL", "GLSL"],

  },
  {
    id: "parallel-computing",
    title: "High-Performance Parallel Computing",
    shortDescription:
      "Benchmarked and optimized parallel algorithms using CUDA and OpenMP. Measured performance and analyzed speedup across Monte Carlo simulations.",

    technologies: ["CUDA", "OpenMP", "NVIDIA Nsight", "gprof"],

    imageUrl: null,
    imageAlt: "",
    imageTags: ["CUDA", "OpenMP"],

  },
  {
    id: "exercise-tracker",
    title: "Full-Stack Exercise Tracker",
    shortDescription:
      "A comprehensive fitness companion built with React and MongoDB. Developed a RESTful API for persistent workout tracking and real-time data management.",

    technologies: ["React", "Node.js", "Express", "MongoDB", "REST API"],

    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC8Mt2vZn-6mCyo5Uhkufjag__v6HsmD-YxY5KRXxOgZo6KVrgx6di82-LjT6TJBBjFOmTX9roGY0-hSS68a0_lEzmVZvKIvOkR2zFxjEqcnBXhpmcApGe7RCCRIUw2zCiTPXA-tqZdQj60UXG9qVaYt-5siXNklF0yOJWbBMFL72HedvH8UsNb_rFjk_xZdZ9HUHgm8QL9GViX_PVmgsmzHnQiZJe_ZxzO-3Ging8C76458-ZQgNAMqJZX2kwbjoa9iCxm6TPOEZw",
    imageAlt: "Exercise Tracker Interface",
    imageTags: ["React", "Node.js"],

  },
];

export default function Projects({ heroImageUrl }: ProjectsProps) {
  const sectionRef = useReveal<HTMLElement>();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const projects = PROJECTS.map((p, i) =>
    i === 0 && heroImageUrl ? { ...p, imageUrl: heroImageUrl } : p,
  );



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
          <div className="bento-1 reveal">
            <button
              type="button"
              className="card project-card project-card-button"
              aria-expanded={expandedId === "vector-field"}

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
              aria-expanded={expandedId === "parallel-computing"}

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

            </div>
          </div>
        </div>
      </div>


    </section>
  );
}

