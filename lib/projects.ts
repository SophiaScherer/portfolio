/**
 * Personal project content.
 *
 * This data is authored in-repo for now, but is shaped to mirror the model it
 * will eventually take in Hygraph. When the CMS entry exists, the migration is:
 *   1. Add a `projects` selection to the query in `lib/content.ts`.
 *   2. Expose a `getProjects()` selector returning `Project[]`.
 *   3. Swap the `PROJECTS` import in `app/page.tsx` for `await getProjects()`.
 *
 * Nothing below imports `server-only` — unlike `lib/content.ts`, these types
 * cross into the client component tree.
 *
 * Fields that may be absent in the CMS are typed nullable so callers can hide
 * the corresponding UI rather than render an empty frame.
 */

export type Tech = string;

export type CaseStudy = {
  label: "Project Overview" | "Challenges & Solutions";
  body: string[];
};

export type Project = {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;

  role: string;
  githubUrl: string | null;

  languages: Tech[];
  technologies: Tech[];

  technicalDetails: string[];
  keyFeatures: string[];
  caseStudy: CaseStudy;

  imageUrl: string | null;
  imageAlt: string;
  imageTags: string[];
};

/* -------------------------------------------------------------------------- */
/* Content                                                                    */
/* -------------------------------------------------------------------------- */

export const PROJECTS: Project[] = [
  {
    id: "vector-field",
    title: "2D Vector Field Visualization",
    shortDescription:
      "Interactive OpenGL system for visualizing vector and scalar fields. Features real-time GLSL Line Integral Convolution (LIC) and streamline tracing for fluid flow analysis.",
    longDescription:
      "An interactive GPU-accelerated visualization tool that renders vector and scalar fields in real time. Built from scratch in C++ with OpenGL and GLSL shaders, the application supports Line Integral Convolution for dense flow textures and streamline tracing for individual particle paths — making it suitable for analyzing fluid dynamics, electromagnetic fields, and other continuous systems.",

    role: "Sole Developer",
    githubUrl: "https://github.com/SophiaScherer/2d-vector-field-visualization",

    languages: ["C++", "GLSL"],
    technologies: ["OpenGL", "GLFW", "GLM", "Dear ImGui"],

    technicalDetails: [
      "Implemented custom fragment shaders for Line Integral Convolution with configurable noise textures and convolution kernel lengths",
      "Designed a streamline integrator using 4th-order Runge-Kutta for stable particle advection through complex fields",
      "Built a real-time UI for adjusting field parameters, color maps, and visualization modes",
    ],
    keyFeatures: [
      "Real-time GLSL LIC rendering",
      "RK4 streamline tracing",
      "Interactive parameter tuning",
      "Multiple color map presets",
    ],
    caseStudy: {
      label: "Project Overview",
      body: [
        "The goal was to build a visualization environment that could handle arbitrary 2D vector and scalar fields while remaining responsive at interactive frame rates.",
        "By moving the heavy texture convolution to the GPU and using ping-pong framebuffers, the renderer sustains 60fps even on dense fields. The desktop UI wraps the rendering surface in Dear ImGui so analysts can tweak field sources, color maps, and visualization modes without recompiling.",
      ],
    },

    imageUrl: null,
    imageAlt: "2D Vector Field Visualization",
    imageTags: ["OpenGL", "GLSL"],
  },
  {
    id: "parallel-computing",
    title: "High-Performance Parallel Computing",
    shortDescription:
      "Benchmarked and optimized parallel algorithms using CUDA and OpenMP. Measured performance and analyzed speedup across Monte Carlo simulations.",
    longDescription:
      "A focused study of parallel algorithm performance across CUDA and OpenMP runtimes. Implemented Monte Carlo simulations and other embarrassingly-parallel workloads, then measured real-world speedup, memory bandwidth, and thread occupancy to characterize where each paradigm excels.",

    role: "Researcher & Implementer",
    githubUrl: "https://github.com/SophiaScherer/parallel-computing-benchmarks",

    languages: ["C", "C++", "CUDA"],
    technologies: ["CUDA", "OpenMP", "NVIDIA Nsight", "gprof"],

    technicalDetails: [
      "Wrote CUDA kernels with shared memory tiling and occupancy tuning for Monte Carlo price simulation",
      "Built OpenMP counterparts using #pragma parallel for with proper reduction clauses",
      "Profiled each implementation with NVIDIA Nsight and gprof to identify memory-bound vs compute-bound bottlenecks",
    ],
    keyFeatures: [
      "CUDA + OpenMP benchmark suite",
      "Memory-bound bottleneck analysis",
      "Speedup / efficiency reporting",
      "Reproducible test harness",
    ],
    caseStudy: {
      label: "Challenges & Solutions",
      body: [
        "Challenge: achieving consistent double-digit speedup on memory-bound kernels. Solution: coalesced memory access patterns and shared-memory tiling reduced global memory pressure and lifted the CUDA kernel from 4× to 10× speedup over a sequential baseline.",
        "Challenge: ensuring statistical correctness as thread counts scaled. Solution: used per-thread RNG streams with a leapfrog generator so results remained reproducible regardless of block configuration.",
      ],
    },

    imageUrl: null,
    imageAlt: "",
    imageTags: ["CUDA", "OpenMP"],
  },
  {
    id: "exercise-tracker",
    title: "Full-Stack Exercise Tracker",
    shortDescription:
      "A comprehensive fitness companion built with React and MongoDB. Developed a RESTful API for persistent workout tracking and real-time data management.",
    longDescription:
      "A full-stack fitness tracking application that lets users log workouts, monitor progress over time, and visualize training volume. The backend exposes a RESTful API for persistent storage while the React frontend delivers an immediate, responsive UI for everyday use.",

    role: "Full-Stack Developer",
    githubUrl: "https://github.com/SophiaScherer/exercise-tracker",

    languages: ["JavaScript", "TypeScript"],
    technologies: ["React", "Node.js", "Express", "MongoDB", "REST API"],

    technicalDetails: [
      "Designed a normalized MongoDB schema for users, exercises, and sessions with proper indexing on common query paths",
      "Implemented Express middleware for request validation and centralized error handling",
      "Built a React frontend with optimistic updates so the UI feels immediate even on slow networks",
    ],
    keyFeatures: [
      "Workout session logging",
      "Progress charts over time",
      "RESTful CRUD API",
      "Persistent user accounts",
    ],
    caseStudy: {
      label: "Project Overview",
      body: [
        "The app was designed to remove friction from logging sets and reps during a workout. Sessions can be created in a few taps and later revisited to chart progression on a per-exercise basis.",
        "On the server side, every resource is exposed through a clean REST surface with consistent error envelopes. The frontend uses React state with optimistic mutations so the UI updates immediately while the request is in flight — and rolls back cleanly if the server rejects it.",
      ],
    },

    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC8Mt2vZn-6mCyo5Uhkufjag__v6HsmD-YxY5KRXxOgZo6KVrgx6di82-LjT6TJBBjFOmTX9roGY0-hSS68a0_lEzmVZvKIvOkR2zFxjEqcnBXhpmcApGe7RCCRIUw2zCiTPXA-tqZdQj60UXG9qVaYt-5siXNklF0yOJWbBMFL72HedvH8UsNb_rFjk_xZdZ9HUHgm8QL9GViX_PVmgsmzHnQiZJe_ZxzO-3Ging8C76458-ZQgNAMqJZX2kwbjoa9iCxm6TPOEZw",
    imageAlt: "Exercise Tracker Interface",
    imageTags: ["React", "Node.js"],
  },
];

/* -------------------------------------------------------------------------- */
/* Selectors                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Look up a single project by id. Returns `null` when no project matches —
 * callers are responsible for hiding the corresponding card.
 *
 * Prefer this over indexing into the array: once projects come from the CMS,
 * their order is not guaranteed.
 */
export const getProjectById = (
  projects: Project[],
  id: string,
): Project | null => projects.find((p) => p.id === id) ?? null;
