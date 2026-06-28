"use client";

import { useReveal } from "../hooks/useReveal";

export default function Interests() {
  const sectionRef = useReveal<HTMLElement>();

  return (
    <section className="section-pad" id="interests" ref={sectionRef}>
      <div className="container">
        <span className="label-cap reveal">Beyond the Code</span>
        <h2 className="h2 reveal reveal-delay-1">Interests</h2>
        <div className="interests-grid">
          <div
            className="card interest-card reveal reveal-delay-1"
            style={{ borderRadius: "1.5rem" }}
          >
            <span className="interest-card-eyebrow">01</span>
            <div className="interest-icon">
              <span className="material-symbols-outlined">insights</span>
            </div>
            <h3 className="h3">Data Visualization</h3>
            <p>
              I enjoy designing visualizations that make complex information easier to understand. Whether it's scientific data or interactive graphics, I'm interested in helping people see patterns that might otherwise be overlooked.
            </p>
          </div>
          <div
            className="card interest-card reveal reveal-delay-2"
            style={{ borderRadius: "1.5rem" }}
          >
            <span className="interest-card-eyebrow">02</span>
            <div className="interest-icon">
              <span className="material-symbols-outlined">settings</span>
            </div>
            <h3 className="h3">Systems &amp; Performance</h3>
            <p>
              I enjoy understanding how software works beneath the surface. From parallel computing and GPU programming to low-level optimization, I'm always looking for ways to make systems faster, more efficient, and more scalable.
            </p>
          </div>
          <div
            className="card interest-card reveal reveal-delay-3"
            style={{ borderRadius: "1.5rem" }}
          >
            <span className="interest-card-eyebrow">03</span>
            <div className="interest-icon">
              <span className="material-symbols-outlined">handshake</span>
            </div>
            <h3 className="h3">Leadership &amp; Service</h3>
            <p>
              Leadership in Scouting taught me how to communicate effectively, support a team, and organize large projects with diverse groups of people. Those experiences continue to shape how I collaborate as an engineer.
            </p>
          </div>
          <div
            className="card interest-card reveal reveal-delay-4"
            style={{ borderRadius: "1.5rem" }}
          >
            <span className="interest-card-eyebrow">04</span>
            <div className="interest-icon">
              <span className="material-symbols-outlined">lightbulb</span>
            </div>
            <h3 className="h3">Building Useful Software</h3>
            <p>
              Many of my favorite project ideas come from everyday frustrations. I enjoy identifying problems in my own workflow and building software that solves them — whether that's improving productivity, simplifying routine tasks, or making technology easier to use.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}