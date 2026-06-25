"use client";

import { useReveal } from "../hooks/useReveal";

export default function Interests() {
  const sectionRef = useReveal<HTMLElement>();

  return (
    <section className="section-pad" id="interests" ref={sectionRef}>
      <div className="container">
        <span className="label-cap reveal">Beyond the Code</span>
        <h2 className="h2 reveal reveal-delay-1">What Drives Me</h2>
        <div className="interests-grid">
          <div
            className="card interest-card reveal reveal-delay-1"
            style={{ borderRadius: "1.5rem" }}
          >
            <div className="interest-icon">
              <span className="material-symbols-outlined">sports_esports</span>
            </div>
            <h3 className="h3">Game Dev &amp; Graphics</h3>
            <p>
              Fascinated by the intersection of mathematics and visual
              storytelling. Building interactive simulations and real-time
              renderers.
            </p>
          </div>
          <div
            className="card interest-card reveal reveal-delay-2"
            style={{ borderRadius: "1.5rem" }}
          >
            <div className="interest-icon">
              <span className="material-symbols-outlined">auto_stories</span>
            </div>
            <h3 className="h3">Worldbuilding</h3>
            <p>
              Crafting elaborate fictional universes with internally consistent
              rules — applying systems thinking to creative storytelling.
            </p>
          </div>
          <div
            className="card interest-card reveal reveal-delay-3"
            style={{ borderRadius: "1.5rem" }}
          >
            <div className="interest-icon">
              <span className="material-symbols-outlined">hiking</span>
            </div>
            <h3 className="h3">Scouting &amp; Outdoors</h3>
            <p>
              Leadership through adventure. Order of the Arrow experience shaped
              my approach to teamwork and community service.
            </p>
          </div>
          <div
            className="card interest-card reveal reveal-delay-4"
            style={{ borderRadius: "1.5rem" }}
          >
            <div className="interest-icon">
              <span className="material-symbols-outlined">psychology</span>
            </div>
            <h3 className="h3">Parallel Systems</h3>
            <p>
              Obsessed with how massive concurrency unlocks computational
              problems that were previously intractable. GPU architecture is
              beautiful.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
