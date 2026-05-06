"use client";

import { useEffect } from "react";

const projects = [
  {
    title: "2D Vector Field Visualization",
    description:
      "Interactive OpenGL system for visualizing complex fields. Features real-time GLSL Line Integral Convolution (LIC) and streamline tracing for fluid flow analysis.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD-IP4y4QglIyhF1wpBEPImKWKbNvH9Cv-tSqo_tDXgNDIZkl7cp-wxICPdczj20xw52bu1jqm0r-zrG2PAQSQ7ve257cMu_bAOTV8MS3-jjgSxmUV_UsoLPT-LaE0uWNuqoFWCay-mfSSlUvvin5DyjPWl_rjpbwptPwKZFSwu4-eu0WztdAUOOn2Ubbden_MvvD7iuvWPT6Q-NmyStwszWjfm6jnZGhxLCMmmendGLHchMCdJmKBL9Ke-HIIC3v2PbWCsSenmx_w",
    tags: ["OpenGL", "GLSL"],
    meta: [
      { icon: "terminal", label: "C++" },
      { icon: "query_stats", label: "Real-time" },
    ],
    gridClass: "bento-1",
  },
  {
    title: "High-Performance Parallel Computing",
    description:
      "Benchmarked and optimized parallel algorithms using CUDA and OpenMP. Conducted rigorous speedup analysis for Monte Carlo simulations.",
    icon: "memory",
    performances: [
      { label: "CUDA", value: "10× Speedup" },
      { label: "OpenMP", value: "Multi-threaded" },
      { label: "Monte Carlo", value: "Optimized" },
    ],
    gridClass: "bento-2",
    isIconCard: true,
  },
  {
    title: "Full-Stack Exercise Tracker",
    description:
      "A comprehensive fitness companion built with React and MongoDB. Engineered a robust RESTful API for seamless data persistence and real-time activity tracking.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC8Mt2vZn-6mCyo5Uhkufjag__v6HsmD-YxY5KRXxOgZo6KVrgx6di82-LjT6TJBBjFOmTX9roGY0-hSS68a0_lEzmVZvKIvOkR2zFxjEqcnBXhpmcApGe7RCCRIUw2zCiTPXA-tqZdQj60UXG9qVaYt-5siXNklF0yOJWbBMFL72HedvH8UsNb_rFjk_xZdZ9HUHgm8QL9GViX_PVmgsmzHnQiZJe_ZxzO-3Ging8C76458-ZQgNAMqJZX2kwbjoa9iCxm6TPOEZw",
    techPills: ["React", "Node.js", "MongoDB", "REST API"],
    gridClass: "bento-3",
    isWide: true,
  },
];

export default function Projects() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="projects-section section-pad" id="projects">
      <div className="container">
        <div className="projects-header">
          <div>
            <span className="label-cap reveal">Portfolio</span>
            <h2 className="h2 reveal reveal-delay-1">Project Lab</h2>
          </div>
          <p className="reveal reveal-delay-2">
            A curated selection of technical explorations spanning graphics,
            parallel systems, and full-stack architecture.
          </p>
        </div>

        <div className="bento">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className={`${project.gridClass} reveal`}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              {project.isIconCard ? (
                <div className="card project-card-icon" style={{ height: "100%" }}>
                  <div>
                    <div className="icon-chip">
                      <span className="material-symbols-outlined">
                        {project.icon}
                      </span>
                    </div>
                    <h3 className="h3" style={{ marginBottom: "12px" }}>
                      {project.title}
                    </h3>
                    <p
                      className="text-muted"
                      style={{ fontSize: "0.9rem", lineHeight: 1.65 }}
                    >
                      {project.description}
                    </p>
                  </div>
                  <div className="perf-table">
                    {project.performances?.map((perf) => (
                      <div key={perf.label} className="perf-row">
                        <span className="perf-label">{perf.label}</span>
                        <span className="perf-value">{perf.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : project.isWide ? (
                <div className="card project-card project-card-wide">
                  <div className="project-body">
                    <h3
                      className="h3"
                      style={{ fontSize: "1.6rem", marginBottom: "14px" }}
                    >
                      {project.title}
                    </h3>
                    <p>
                      {project.description}
                    </p>
                    <div className="tech-pills">
                      {project.techPills?.map((pill) => (
                        <span key={pill} className="tech-pill">
                          {pill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div
                    className="project-img-wrap"
                    style={{ flex: "0 0 46%" }}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="card project-card" style={{ height: "100%" }}>
                  <div className="project-img-wrap">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="img-tags">
                      {project.tags?.map((tag) => (
                        <span key={tag} className="img-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="project-body">
                    <h3 className="h3">{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="project-meta">
                      {project.meta?.map((item) => (
                        <span key={item.label} className="project-meta-item">
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: "14px" }}
                          >
                            {item.icon}
                          </span>
                          {item.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
