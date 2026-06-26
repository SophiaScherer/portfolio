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
              <span className="material-symbols-outlined">analytics</span>
            </div>
            <h3 className="h3">Data Visualization</h3>
            <p>
              I enjoy transforming complex datasets into intuitive visualizations that help people understand patterns, relationships, and decisions more clearly.
            </p>
          </div>
          <div
            className="card interest-card reveal reveal-delay-2"
            style={{ borderRadius: "1.5rem" }}
          >
            <div className="interest-icon">
              <span className="material-symbols-outlined">ssid_chart</span>
            </div>
            <h3 className="h3">Systems & Performance</h3>
            <p>
              I'm fascinated by how software performs under the hood, from parallel algorithms and GPU computing to optimizing systems for speed, scalability, and efficiency.
            </p>
          </div>
          <div
            className="card interest-card reveal reveal-delay-3"
            style={{ borderRadius: "1.5rem" }}
          >
            <div className="interest-icon">
              <span className="material-symbols-outlined">hiking</span>
            </div>
            <h3 className="h3">Leadership & Service</h3>
            <p>
              My experience in Scouting taught me how to lead teams, communicate effectively, and build communities through service. Those lessons continue to shape how I approach collaboration.
            </p>
          </div>
          <div
            className="card interest-card reveal reveal-delay-4"
            style={{ borderRadius: "1.5rem" }}
          >
            <div className="interest-icon">
              <span className="material-symbols-outlined">psychology</span>
            </div>
            <h3 className="h3">Beyond the Keyboard</h3>
            <p>
              Outside of computing, you'll usually find me hiking, running, attending a baseball game, or working on creative projects that blend technical and artistic thinking.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
