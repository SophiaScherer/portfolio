/* Server component: the hero's entrance plays from CSS on load
   (`.reveal-onload`), so it needs no client-side reveal hook. */
export default function Hero() {
  return (
    <section className="hero section-pad" id="about">
      <div className="hero-dots" aria-hidden="true" />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="hero-grid">
          <div className="hero-body">
            <span className="hero-kicker reveal-onload">
              Sophia Scherer · CS @ Oregon State
            </span>
            <h1 className="h1 reveal-onload reveal-delay-1">
              Building high-performance software
            </h1>
            <p className="reveal-onload reveal-delay-2">
              Honors <strong>Computer Science</strong> student at Oregon State
              University specializing in systems programming, data
              visualization, and high-performance computing. I enjoy solving
              complex technical problems and building software that is
              efficient, reliable, and easy to use.
            </p>
            <div className="hero-ctas reveal-onload reveal-delay-3">
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
                >
                  mail
                </span>
              </a>
            </div>
          </div>

          <div className="hero-panel reveal-onload reveal-delay-4">
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
