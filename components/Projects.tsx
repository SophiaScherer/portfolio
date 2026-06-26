"use client";

import { useReveal } from "../hooks/useReveal";
import Image from "next/image";

export default function Projects() {
  const sectionRef = useReveal<HTMLElement>();

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
            Projects exploring computer graphics, high-performance computing, systems programming, and full-stack development.
          </p>
        </div>

        <div className="bento">
          <div className="bento-1 reveal">
            <div className="card project-card" style={{ height: "100%" }}>
              <div className="project-img-wrap">
                <img
                  src="/vectorVisPicture.png"
                  alt="2D Vector Field Visualization"
                />
                <div className="img-tags">
                  <span className="img-tag">OpenGL</span>
                  <span className="img-tag">GLSL</span>
                </div>
              </div>
              <div className="project-body">
                <h3 className="h3">2D Vector Field Visualization</h3>
                <p>
                  Interactive OpenGL system for visualizing complex fields.
                  Features real-time GLSL Line Integral Convolution (LIC) and
                  streamline tracing for fluid flow analysis.
                </p>
                <div className="project-meta">
                  <span className="project-meta-item">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "14px" }}
                    >
                      terminal
                    </span>{" "}
                    C++
                  </span>
                  <span className="project-meta-item">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "14px" }}
                    >
                      query_stats
                    </span>{" "}
                    Real-time
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bento-2 reveal reveal-delay-1">
            <div className="card project-card-icon" style={{ height: "100%" }}>
              <div>
                <div className="icon-chip">
                  <span className="material-symbols-outlined">memory</span>
                </div>
                <h3 className="h3" style={{ marginBottom: "12px" }}>
                  High-Performance Parallel Computing
                </h3>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.9rem",
                    lineHeight: 1.65,
                  }}
                >
                  Benchmarked and optimized parallel algorithms using CUDA and
                  OpenMP. Conducted rigorous speedup analysis for Monte Carlo
                  simulations.
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
            </div>
          </div>

          <div className="bento-3 reveal reveal-delay-2">
            <div className="card project-card project-card-wide">
              <div className="project-body">
                <h3 className="h3" style={{ fontSize: "1.6rem", marginBottom: "14px" }}>
                  Full-Stack Exercise Tracker
                </h3>
                <p>
                  A comprehensive fitness companion built with React and
                  MongoDB. Engineered a robust RESTful API for seamless data
                  persistence and real-time activity tracking.
                </p>
                <div className="tech-pills">
                  <span className="tech-pill">React</span>
                  <span className="tech-pill">Node.js</span>
                  <span className="tech-pill">MongoDB</span>
                  <span className="tech-pill">REST API</span>
                </div>
              </div>
              <div className="project-img-wrap" style={{ flex: "0 0 46%" }}>
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8Mt2vZn-6mCyo5Uhkufjag__v6HsmD-YxY5KRXxOgZo6KVrgx6di82-LjT6TJBBjFOmTX9roGY0-hSS68a0_lEzmVZvKIvOkR2zFxjEqcnBXhpmcApGe7RCCRIUw2zCiTPXA-tqZdQj60UXG9qVaYt-5siXNklF0yOJWbBMFL72HedvH8UsNb_rFjk_xZdZ9HUHgm8QL9GViX_PVmgsmzHnQiZJe_ZxzO-3Ging8C76458-ZQgNAMqJZX2kwbjoa9iCxm6TPOEZw"
                  alt="Exercise Tracker Interface"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
