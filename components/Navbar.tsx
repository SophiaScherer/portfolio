"use client";

import type { CSSProperties, MouseEvent } from "react";
import { flushSync } from "react-dom";
import ThemeToggle from "./ThemeToggle";
import { useNavActive } from "../hooks/useNavActive";
import { useHamburger } from "../hooks/useHamburger";
import { useModal } from "../hooks/useModal";
import { NAV_LINKS, NAV_SECTION_IDS, SOCIAL_LINKS } from "../lib/links";
import { toIndexLabel } from "../lib/format";

type Resume = { url: string; fileName: string };

type NavbarProps = {
  resume: Resume | null;
};

export default function Navbar({ resume }: NavbarProps) {
  const activeId = useNavActive(NAV_SECTION_IDS);
  const { open, toggle, close } = useHamburger();

  // The trap wraps both the bar and the menu, so the hamburger (which closes
  // the menu) stays reachable by keyboard while the menu is open.
  const headerRef = useModal<HTMLDivElement>({ open, onClose: close });

  // Menu links close the menu synchronously before scrolling: a smooth scroll
  // started while the scroll lock is still on gets cancelled when it releases.
  const goToSection = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    flushSync(close);
    document.getElementById(id)?.scrollIntoView();
    history.pushState(null, "", `#${id}`);
  };

  // Styled through `[aria-current]`, so one attribute drives both a11y and CSS.
  const activeProps = (id: string) =>
    activeId === id ? { "aria-current": "true" as const } : {};

  return (
    <div className="site-header" ref={headerRef} tabIndex={-1}>
      <div className="nav-wrap">
        <nav className="nav" aria-label="Primary">
          <a href="#about" className="nav-logo">
            Sophia Scherer
          </a>
          <ul className="nav-links">
            {NAV_LINKS.map(({ id, label }) => (
              <li key={id}>
                <a href={`#${id}`} {...activeProps(id)}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className="nav-right">
            <ThemeToggle />
            {resume && <ResumeLink resume={resume} className="nav-resume" />}
            <button
              type="button"
              className={`hamburger${open ? " open" : ""}`}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobileMenu"
              onClick={toggle}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>
      </div>

      <div
        className={`mobile-menu${open ? " open" : ""}`}
        id="mobileMenu"
        inert={!open}
      >
        <nav aria-label="Mobile">
          <ol className="mobile-menu-links">
            {NAV_LINKS.map(({ id, label }, i) => (
              <li key={id} style={{ "--i": i } as CSSProperties}>
                <a
                  href={`#${id}`}
                  className="mobile-menu-link"
                  onClick={(event) => goToSection(event, id)}
                  {...activeProps(id)}
                >
                  <span className="mobile-menu-link-index" aria-hidden="true">
                    {toIndexLabel(i)}
                  </span>
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mobile-menu-footer">
          {resume && (
            <ResumeLink
              resume={resume}
              className="mobile-menu-resume"
              onClick={close}
            />
          )}
          <div className="mobile-menu-socials">
            {SOCIAL_LINKS.map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ResumeLink({
  resume,
  className,
  onClick,
}: {
  resume: Resume;
  className: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={resume.url}
      target="_blank"
      rel="noopener noreferrer"
      download={resume.fileName}
      className={`btn-primary ${className}`}
      onClick={onClick}
    >
      Resume
    </a>
  );
}
