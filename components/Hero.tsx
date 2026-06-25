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
            <span className="label-cap reveal">
              Sophia Scherer — Computer Science @ OSU
            </span>
            <h1
              className="h1 reveal reveal-delay-1"
              style={{ marginBottom: "24px" }}
            >
              Designing systems
              <br />
              that feel like <em className="text-accent">magic.</em>
            </h1>
            <p className="reveal reveal-delay-2">
              Honors B.S. student at Oregon State University specializing in
              high-performance computing and visualization. Balancing complex
              algorithms with a vibrant approach to software engineering.
            </p>
            <div className="hero-ctas reveal reveal-delay-3">
              <a href="#projects" className="btn-primary">
                View Lab{" "}
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "18px" }}
                >
                  terminal
                </span>
              </a>
              <a href="#contact" className="btn-outline">
                Say Hello
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
              <span className="hero-gpa-val">3.55</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
