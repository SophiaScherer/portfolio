/**
 * "Beyond the Code" interest cards. Authored in-repo like `lib/projects.ts`,
 * so the section renders from data rather than repeated markup.
 */

export type Interest = {
  id: string;
  /** Material Symbols icon name. */
  icon: string;
  title: string;
  description: string;
};

export const INTERESTS: readonly Interest[] = [
  {
    id: "data-visualization",
    icon: "insights",
    title: "Data Visualization",
    description:
      "I enjoy designing visualizations that make complex information easier to understand. Whether it's scientific data or interactive graphics, I'm interested in helping people see patterns that might otherwise be overlooked.",
  },
  {
    id: "systems-performance",
    icon: "settings",
    title: "Systems & Performance",
    description:
      "I enjoy understanding how software works beneath the surface. From parallel computing and GPU programming to low-level optimization, I'm always looking for ways to make systems faster, more efficient, and more scalable.",
  },
  {
    id: "leadership-service",
    icon: "handshake",
    title: "Leadership & Service",
    description:
      "Leadership in Scouting taught me how to communicate effectively, support a team, and organize large projects with diverse groups of people. Those experiences continue to shape how I collaborate as an engineer.",
  },
  {
    id: "useful-software",
    icon: "lightbulb",
    title: "Building Useful Software",
    description:
      "Many of my favorite project ideas come from everyday frustrations. I enjoy identifying problems in my own workflow and building software that solves them — whether that's improving productivity, simplifying routine tasks, or making technology easier to use.",
  },
];
