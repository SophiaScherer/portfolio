"use client";

import { useReveal } from "../hooks/useReveal";

export default function Experience() {
  const sectionRef = useReveal<HTMLElement>();

  return (
    <section
      className="experience-section section-pad"
      id="experience"
      ref={sectionRef}
    >
      <div className="container">
        <div className="exp-grid">
          <div>
            <span className="label-cap reveal">The Toolkit</span>
            <h2 className="h2 reveal reveal-delay-1">Expertise</h2>
            <div className="skills-cloud reveal reveal-delay-2">
              <span className="tag">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "14px" }}
                >
                  terminal
                </span>{" "}
                C++
              </span>
              <span className="tag">C</span>
              <span className="tag">Java</span>
              <span className="tag">React</span>
              <span className="tag">MongoDB</span>
              <span className="tag">CUDA</span>
              <span className="tag">OpenCL</span>
              <span className="tag">OpenGL</span>
              <span className="tag">GLSL</span>
              <span className="tag">Node.js</span>
              <span className="tag">Git</span>
              <span className="tag">OpenMP</span>
            </div>
          </div>

          <div>
            <span className="label-cap reveal">My Journey</span>
            <h2 className="h2 reveal reveal-delay-1">Experience</h2>
            <div className="timeline reveal reveal-delay-2">
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-header">
                  <span className="timeline-title">
                    Honors B.S. in Computer Science
                  </span>
                  <span className="timeline-date">2023 — 2027</span>
                </div>
                <p className="timeline-org">Oregon State University</p>
                <p className="timeline-desc">
                  Focusing on high-level system architecture and parallel
                  computing. Current GPA: 3.55.
                </p>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot dim-1"></div>
                <div className="timeline-header">
                  <span className="timeline-title">Student Trainer</span>
                  <span className="timeline-date">2023 — Present</span>
                </div>
                <p className="timeline-org">
                  University Housing &amp; Dining Services (UHDS)
                </p>
                <p className="timeline-desc">
                  Developing training protocols and mentoring new staff members
                  within a large-scale university operation.
                </p>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot dim-2"></div>
                <div className="timeline-header">
                  <span className="timeline-title">Treasurer &amp; Vice Chief</span>
                  <span className="timeline-date">Order of the Arrow</span>
                </div>
                <p className="timeline-org">Boy Scouts of America</p>
                <p className="timeline-desc">
                  Managed financial reporting and led organizational strategy
                  for youth leadership divisions.
                </p>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot dim-3"></div>
                <div className="timeline-header">
                  <span className="timeline-title">Shift Lead</span>
                  <span className="timeline-date">Past Experience</span>
                </div>
                <p className="timeline-org">Freshii</p>
                <p className="timeline-desc">
                  Managed team operations and maintained high standards of
                  customer service and operational efficiency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
