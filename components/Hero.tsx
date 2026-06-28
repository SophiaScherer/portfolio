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
            <span className="hero-eyebrow reveal reveal-delay-1">
              <span className="hero-eyebrow-dot" aria-hidden="true" />
              Sophia Scherer · CS @ Oregon State
            </span>
            <h1
              className="h1 reveal reveal-delay-1"
              style={{ marginBottom: "24px" }}
            >
              Building
              <br />
              <em className="text-accent">high-performance</em> software
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

          <div className="hero-card-wrap reveal reveal-delay-2">
            <div className="hero-card">
              <span className="material-symbols-outlined">code_blocks</span>
              <span className="hero-card-label">
                Oregon State University
                <br />
                Class of 2027
              </span>
            </div>
            <div className="hero-gpa">
              <span className="hero-gpa-label">GPA</span>
              <span className="hero-gpa-val">3.59</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}