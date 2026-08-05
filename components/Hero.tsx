"use client";

import { useReveal } from "../hooks/useReveal";

export default function Hero() {
  const sectionRef = useReveal<HTMLElement>();

  return (
    <section
      className="hero section-pad"
      id="about"
      ref={sectionRef}
    >
      <div className="hero-dots" aria-hidden="true" />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="hero-grid">
          <div className="hero-body">
            <span className="hero-kicker reveal reveal-delay-1">
              Sophia Scherer · CS @ Oregon State
            </span>
            <h1
              className="h1 reveal reveal-delay-1"
              style={{ marginBottom: "24px" }}
            >
              Building high-performance software
            </h1>
            <p className="reveal reveal-delay-2">
              Honors <strong>Computer Science</strong> student at Oregon State
              University specializing in systems programming, data
              visualization, and high-performance computing. I enjoy solving
              complex technical problems and building software that is
              efficient, reliable, and easy to use.
            </p>
            <div className="hero-ctas reveal reveal-delay-3">
              <a href="#projects" className="btn-primary">
                Projects
                <span
                  className="material-symbols-outlined btn-icon"
                  aria-hidden="true"
                >
                  arrow_forward
                </span>
              </a>
              <a href="#contact" className="btn-outline">
                Contact Me
                <span
                  className="material-symbols-outlined btn-icon"
                  aria-hidden="true"
                  style={{ fontSize: "18px" }}
                >
                  mail
                </span>
              </a>
            </div>
          </div>

          <div className="hero-panel reveal reveal-delay-2">
            <div className="hero-panel-top">
              <span className="material-symbols-outlined" aria-hidden="true">
                code_blocks
              </span>
              <span className="hero-panel-label">
                Oregon State University
                <br />
                Class of 2027
              </span>
            </div>
            <div className="hero-panel-divider" aria-hidden="true" />
            <div className="hero-panel-gpa">
              <span>GPA</span>
              <strong>3.59</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}