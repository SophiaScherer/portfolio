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
            <span className="label-cap reveal">Skills</span>
            <h2 className="h2 reveal reveal-delay-1">Technical Skills</h2>
            <div className="skills-cloud reveal reveal-delay-2">
              <span className="tag">
                C++
              </span>
              <span className="tag">C</span>
              <span className="tag">Java</span>
              <span className="tag">JavaScript</span>
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
            <span className="label-cap reveal">Work</span>
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
                  Coursework focused on operating systems, computer graphics, networking, algorithms, and high-performance computing. Current GPA: 3.59.
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
                  Train and mentor new student employees while helping maintain consistent service and food safety standards.
                </p>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot dim-2"></div>
                <div className="timeline-header">
                  <span className="timeline-title">Treasurer &amp; Vice Chief</span>
                  <span className="timeline-date">2023 — 2025</span>
                </div>
                <p className="timeline-org">Boy Scouts of America</p>
                <p className="timeline-desc">
                  Managed budgets, coordinated large-scale events, and served in youth leadership roles supporting over 400 participants.
                </p>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot dim-3"></div>
                <div className="timeline-header">
                  <span className="timeline-title">Shift Lead</span>
                  <span className="timeline-date">January 2023 — June 2023</span>
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
