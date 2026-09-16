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
 *
 * Array order is display order: `<Projects>` maps this list straight onto the
 * bento grid, so the newest project goes first.
 */

export type Tech = string;

export type CaseStudy = {
  label: "Project Overview" | "Challenges & Solutions";
  body: string[];
};

/**
 * Which bento card renders this project. The variant also picks the grid cell,
 * so the three projects must use three different variants.
 *   image — tall card with a cover image and a `cardMeta` row
 *   icon  — icon chip card with a `perfRows` table, no image
 *   wide  — full-width two-column card with tech pills and an image
 */
export type CardVariant = "image" | "icon" | "wide";

/** One entry in the `image` card's meta row. `icon` is a Material Symbols name. */
export type CardMeta = { icon: string; label: string };

/** One row of the `icon` card's stat table. */
export type PerfRow = { label: string; value: string };

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

  /* Presentation. Each field below is read by one variant only. */
  cardVariant: CardVariant;
  /** Material Symbols name for the `icon` variant's chip. Null otherwise. */
  cardIcon: string | null;
  /** `image` variant only. Empty for the others. */
  cardMeta: CardMeta[];
  /** `icon` variant only. Empty for the others. */
  perfRows: PerfRow[];
};

/* -------------------------------------------------------------------------- */
/* Content                                                                    */
/* -------------------------------------------------------------------------- */

export const PROJECTS: Project[] = [
  {
    id: "dash-detective",
    title: "DashDetective",
    shortDescription:
      "A system-information console built with Avalonia UI on .NET 10, fully supported on Windows with Linux in progress. Nine tabs of live machine metrics — processes, performance, network, storage and hardware — read straight from the operating system.",
    longDescription:
      "A desktop system monitor that reads the local machine and renders it as nine tabs: Dashboard, File Explorer, Processes, Performance, Network, Storage, Hardware, Toolkit and Settings. Built on Avalonia UI with MVVM, it compiles to a single neutral .NET 10 target and picks its data source at runtime — performance counters, WMI and Win32 interop on Windows, the /proc and /sys pseudo-files on Linux, where readers are still landing one at a time. Every reader degrades on its own, so a source that goes missing shows a placeholder rather than taking the app down.",

    role: "Sole Developer",
    githubUrl: "https://github.com/SophiaScherer/DashDetective",

    languages: ["C#", "XAML"],
    technologies: ["Avalonia UI", ".NET 10", "MVVM", "Win32 P/Invoke", "xUnit"],

    technicalDetails: [
      "Hand-wrote every native binding across 22 interop files — PDH performance counters, iphlpapi connection tables, DXGI adapters and NVML/ADL sensors — with no redistributed native libraries and no administrator rights",
      "Attributed GPU load to physical adapters by LUID, reaching DXGI through raw vtable function pointers because built-in COM is disabled at runtime, then intersecting the adapter set against the counters that actually report",
      "Held the dependency graph to eight packages by writing the chart control, layout engine and metric fan-out in house; shared samplers are ref-counted, so two tabs watching CPU cause one poll",
    ],
    keyFeatures: [
      "Nine live system tabs",
      "Per-adapter multi-GPU metrics",
      "Drag-to-reorder widget board",
      "Measured accessibility palettes",
    ],
    caseStudy: {
      label: "Challenges & Solutions",
      body: [
        "Challenge: reporting real hardware without shipping native dependencies or demanding administrator rights. Solution: hand-written P/Invoke against interfaces Windows already exposes — performance counters for GPU and disk, Toolhelp32 and window enumeration for process classification, a non-admin IOCTL for NVMe temperature — so the app reads the machine honestly from an ordinary user session.",
        "Challenge: keeping one codebase honest across platforms without #if directives. Solution: a single neutral .NET 10 target with one runtime seam per data source, which also turns the platform-compatibility analyzer into a real build gate. Warnings are errors, CI runs the suite on Windows and Linux in both configurations, and CodeQL sweeps the interop weekly because the analyzer cannot see hand-written declarations.",
      ],
    },

    imageUrl: null,
    imageAlt: "DashDetective system information console",
    imageTags: ["C#", "Avalonia"],

    cardVariant: "image",
    cardIcon: null,
    cardMeta: [
      { icon: "terminal", label: "C#" },
      { icon: "devices", label: "Cross-platform" },
    ],
    perfRows: [],
  },
  {
    id: "unpawse",
    title: "unPawse",
    shortDescription:
      "An Android screen-time manager with a cat-shaped escape hatch. A foreground service meters per-app usage and blocks whatever runs over budget; earning time back means photographing a real cat, verified on-device.",
    longDescription:
      "A Jetpack Compose screen-time app built around one loop: pick apps and daily limits, let a foreground service count the time actually spent in them, and block an app once its budget runs out. Getting back in requires photographing a cat, which an on-device ML Kit labeler verifies without anything leaving the phone. A daily cap and a cooldown keep the escape hatch from defeating the limits it is attached to.",

    role: "Sole Developer",
    githubUrl: "https://github.com/SophiaScherer/unPawse",

    languages: ["Kotlin"],
    technologies: ["Jetpack Compose", "ML Kit", "Room", "CameraX", "WorkManager"],

    technicalDetails: [
      "Detected the foreground app without an AccessibilityService by folding UsageStatsManager events into a stack — a single last-resumed slot sticks on the launcher forever, because swiping to Recents raises the launcher without ever pausing the app underneath",
      "Hosted Compose inside a Service by implementing LifecycleOwner, ViewModelStoreOwner, SavedStateRegistryOwner and OnBackPressedDispatcherOwner on the overlay window, which normally inherits all four from an Activity",
      "Kept accrual honest under doze and process death by clamping each tick and crediting elapsed time to whichever app was actually in front for it, with the policy math extracted to pure functions and covered by 657 unit tests",
    ],
    keyFeatures: [
      "On-device cat verification",
      "Per-app daily budgets",
      "Schedules and focus sessions",
      "Versioned ZIP export and import",
    ],
    caseStudy: {
      label: "Project Overview",
      body: [
        "The app exists because a timer you can dismiss is not a limit. Enforcement runs in a foreground service that survives reboot and re-arms itself through a WorkManager backstop, and it draws over the offending app rather than asking politely. Reaching for the blunter tool was deliberate: an AccessibilityService would have been faster and quieter, but it is the wrong permission to ask for and Play review treats it that way.",
        "The cat requirement is the design — it costs just enough effort to break the reflex, and it is verified on-device so no photo ever leaves the phone. A sixty-minute daily cap and a ten-minute cooldown close the photo-for-time loop that would otherwise reopen the limit. Achievements and streaks are derived from the photos themselves rather than stored, so deleting a run of pictures correctly takes the badge with it.",
      ],
    },

    imageUrl: null,
    imageAlt: "unPawse block screen",
    imageTags: ["Kotlin", "Compose"],

    cardVariant: "icon",
    cardIcon: "pets",
    cardMeta: [],
    perfRows: [
      { label: "Kotlin", value: "Jetpack Compose" },
      { label: "ML Kit", value: "On-Device" },
      { label: "Coverage", value: "657 Tests" },
    ],
  },
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

    cardVariant: "wide",
    cardIcon: null,
    cardMeta: [],
    perfRows: [],
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
