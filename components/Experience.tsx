"use client";

import { useEffect } from "react";

const skills = [
  "C++",
  "C",
  "Java",
  "React",
  "MongoDB",
  "CUDA",
  "OpenCL",
  "OpenGL",
  "GLSL",
  "Node.js",
  "Git",
  "OpenMP",
];

const experiences = [
  {
    title: "Honors B.S. in Computer Science",
    date: "2023 — 2027",
    org: "Oregon State University",
    desc: "Focusing on high-level system architecture and parallel computing. Current GPA: 3.55.",
    dotClass: "",
  },
  {
    title: "Student Trainer",
    date: "2023 — Present",
    org: "University Housing & Dining Services (UHDS)",
    desc: "Developing training protocols and mentoring new staff members within a large-scale university operation.",
    dotClass: "dim-1",
  },
  {
    title: "Treasurer & Vice Chief",
    date: "Order of the Arrow",
    org: "Boy Scouts of America",
    desc: "Managed financial reporting and led organizational strategy for youth leadership divisions.",
    dotClass: "dim-2",
  },
  {
    title: "Shift Lead",
    date: "Past Experience",
    org: "Freshii",
    desc: "Managed team operations and maintained high standards of customer service and operational efficiency.",
    dotClass: "dim-3",
  },
];

export default function Experience() {
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
    <section className="experience-section section-pad" id="experience">
      <div className="container">
        <div className="exp-grid">
          {/* Skills */}
          <div>
            <span className="label-cap reveal">The Toolkit</span>
            <h2 className="h2 reveal reveal-delay-1">Expertise</h2>
            <div className="skills-cloud reveal reveal-delay-2">
              {skills.map((skill) => (
                <span key={skill} className="tag">
                  {skill === "C++" && (
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "14px" }}
                    >
                      terminal
                    </span>
                  )}
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <span className="label-cap reveal">My Journey</span>
            <h2 className="h2 reveal reveal-delay-1">Experience</h2>
            <div className="timeline reveal reveal-delay-2">
              {experiences.map((exp) => (
                <div key={exp.title} className="timeline-item">
                  <div className={`timeline-dot ${exp.dotClass}`} />
                  <div className="timeline-header">
                    <span className="timeline-title">{exp.title}</span>
                    <span className="timeline-date">{exp.date}</span>
                  </div>
                  <p className="timeline-org">{exp.org}</p>
                  <p className="timeline-desc">{exp.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
