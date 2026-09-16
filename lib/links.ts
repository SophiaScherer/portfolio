/**
 * Site navigation targets, shared by the desktop nav, the mobile menu, and the
 * footer so every list stays in sync.
 */

export type NavLink = {
  /** Id of the page section the link scrolls to. */
  id: string;
  label: string;
};

export type SocialLink = {
  label: string;
  href: string;
};

export const NAV_LINKS: readonly NavLink[] = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "interests", label: "Interests" },
  { id: "contact", label: "Contact" },
];

/** Section ids in page order, for active-link tracking. */
export const NAV_SECTION_IDS: readonly string[] = NAV_LINKS.map((l) => l.id);

export const SOCIAL_LINKS: readonly SocialLink[] = [
  { label: "GitHub", href: "https://github.com/SophiaScherer" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sophia-scherer/" },
];
