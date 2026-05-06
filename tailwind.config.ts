import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-2": "var(--bg-2)",
        "bg-3": "var(--bg-3)",
        surface: "var(--surface)",
        "surface-border": "var(--surface-border)",
        primary: "var(--primary)",
        "primary-glow": "var(--primary-glow)",
        secondary: "var(--secondary)",
        "secondary-soft": "var(--secondary-soft)",
        accent: "var(--accent)",
        "on-primary": "var(--on-primary)",
        text: "var(--text)",
        "text-muted": "var(--text-muted)",
        outline: "var(--outline)",
        "tag-bg": "var(--tag-bg)",
        "tag-text": "var(--tag-text)",
        "nav-bg": "var(--nav-bg)",
        "nav-border": "var(--nav-border)",
        "nav-shadow": "var(--nav-shadow)",
        "card-shadow": "var(--card-shadow)",
        "glow-a": "var(--glow-a)",
        "glow-b": "var(--glow-b)",
        "contact-form-bg": "var(--contact-form-bg)",
        "footer-bg": "var(--footer-bg)",
        "footer-border": "var(--footer-border)",
        "hero-dot": "var(--hero-dot)",
        "timeline-line": "var(--timeline-line)",
        "timeline-dot": "var(--timeline-dot)",
        "switch-track": "var(--switch-track)",
        "switch-knob": "var(--switch-knob)",
        "switch-icon-l": "var(--switch-icon-l)",
        "switch-icon-d": "var(--switch-icon-d)",
      },
      fontFamily: {
        epilogue: ["Epilogue", "sans-serif"],
        jakarta: ["Plus Jakarta Sans", "sans-serif"],
        grotesk: ["Space Grotesk", "sans-serif"],
      },
      boxShadow: {
        card: "var(--card-shadow)",
        nav: "var(--nav-shadow)",
      },
    },
  },
  plugins: [],
};

export default config;
