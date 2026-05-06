"use client";

import { useEffect } from "react";

const interests = [
  {
    icon: "sports_esports",
    title: "Game Dev & Graphics",
    description:
      "Fascinated by the intersection of mathematics and visual storytelling. Building interactive simulations and real-time renderers.",
  },
  {
    icon: "auto_stories",
    title: "Worldbuilding",
    description:
      "Crafting elaborate fictional universes with internally consistent rules — applying systems thinking to creative storytelling.",
  },
  {
    icon: "hiking",
    title: "Scouting & Outdoors",
    description:
      "Leadership through adventure. Order of the Arrow experience shaped my approach to teamwork and community service.",
  },
  {
    icon: "psychology",
    title: "Parallel Systems",
    description:
      "Obsessed with how massive concurrency unlocks computational problems that were previously intractable. GPU architecture is beautiful.",
  },
];

export default function Interests() {
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
    <section className="section-pad" id="interests">
      <div className="container">
        <span className="reveal label-cap">Beyond the Code</span>
        <h2 className="h2 reveal reveal-delay-1">What Drives Me</h2>
        <div className="interests-grid">
          {interests.map((interest, index) => (
            <div
              key={interest.title}
              className="card interest-card reveal"
              style={{ transitionDelay: `${(index + 1) * 0.1}s` }}
            >
              <div className="interest-icon">
                <span className="material-symbols-outlined">
                  {interest.icon}
                </span>
              </div>
              <h3 className="h3">{interest.title}</h3>
              <p>{interest.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
