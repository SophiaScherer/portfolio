/**
 * Skills and timeline for the Experience section. Authored in-repo like
 * `lib/projects.ts`, so the section renders from data rather than markup.
 */

import { PROFILE } from "./profile";

export type SkillGroup = { label: string; skills: string[] };

export type TimelineItem = {
  title: string;
  dates: string;
  org: string;
  description: string;
};

export const SKILL_GROUPS: readonly SkillGroup[] = [
  {
    label: "Languages",
    skills: ["C++", "C", "Java", "JavaScript", "TypeScript", "GLSL"],
  },
  {
    label: "Frameworks & Libraries",
    skills: ["React", "Node.js", "OpenGL", "OpenMP", "OpenCL"],
  },
  {
    label: "Tools & Platforms",
    skills: ["CUDA", "MongoDB", "Git"],
  },
];

/** Newest first; the timeline dots fade with each step back. */
export const TIMELINE: readonly TimelineItem[] = [
  {
    title: "Honors B.S. in Computer Science",
    dates: `2023 — ${PROFILE.graduationYear}`,
    org: PROFILE.school,
    description: `Coursework focused on operating systems, computer graphics, networking, algorithms, and high-performance computing. Current GPA: ${PROFILE.gpa}.`,
  },
  {
    title: "Student Trainer",
    dates: "2023 — Present",
    org: "University Housing & Dining Services (UHDS)",
    description:
      "Train and mentor new student employees while helping maintain consistent service and food safety standards.",
  },
  {
    title: "Treasurer & Vice Chief",
    dates: "2023 — 2025",
    org: "Boy Scouts of America",
    description:
      "Managed budgets, coordinated large-scale events, and served in youth leadership roles supporting over 400 participants.",
  },
  {
    title: "Shift Lead",
    dates: "January 2023 — June 2023",
    org: "Freshii",
    description:
      "Managed team operations and maintained high standards of customer service and operational efficiency.",
  },
];
