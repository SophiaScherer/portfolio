"use client";

import type { CSSProperties, MouseEvent } from "react";
import { flushSync } from "react-dom";
import ThemeToggle from "./ThemeToggle";
import { useNavActive } from "../hooks/useNavActive";
import { useHamburger } from "../hooks/useHamburger";
import { useModal } from "../hooks/useModal";
import type { ResumeDownload } from "../lib/content";
import {
  EXTERNAL_LINK_PROPS,
  NAV_LINKS,
  NAV_SECTION_IDS,
  SOCIAL_LINKS,
  sectionHref,
} from "../lib/links";
import { toIndexLabel } from "../lib/format";

type NavbarProps = {
  resume: ResumeDownload | null;
};

export default function Navbar({ resume }: NavbarProps) {
  const activeId = useNavActive(NAV_SECTION_IDS);
  const { open, toggle, close, dismiss } = useHamburger();

  // The trap wraps both the bar and the menu, so the hamburger (which closes
  // the menu) stays reachable by keyboard while the menu is open.
  const headerRef = useModal<HTMLElement>({ open, onClose: close });

  // Menu links close the menu synchronously before scrolling: a smooth scroll
  // started while the scroll lock is still on gets cancelled when it releases.
  // The menu's history entry becomes the section's, so Back leaves both.
  // Off the home page there's no section to scroll to, so go home instead.
  const goToSection = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const section = document.getElementById(id);
    if (!section) return;
    event.preventDefault();
    flushSync(dismiss);
    section.scrollIntoView();
    window.history.replaceState(null, "", `#${id}`);
  };

  // Styled through `[aria-current]`, so one attribute drives both a11y and CSS.
  const activeProps = (id: string) =>
    activeId === id ? { "aria-current": "true" as const } : {};

  return (
    <header className="site-header" ref={headerRef} tabIndex={-1}>
      <div className="nav-wrap">
        <nav className="nav" aria-label="Primary">
          <a href={sectionHref("about")} className="nav-logo">
            Sophia Scherer
          </a>
          <ul className="nav-links">
            {NAV_LINKS.map(({ id, label }) => (
              <li key={id}>
                <a href={sectionHref(id)} {...activeProps(id)}>
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
                  href={sectionHref(id)}
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
              <a key={label} href={href} {...EXTERNAL_LINK_PROPS}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

function ResumeLink({
  resume,
  className,
  onClick,
}: {
  resume: ResumeDownload;
  className: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={resume.url}
      {...EXTERNAL_LINK_PROPS}
      className={`btn-primary ${className}`}
      onClick={onClick}
    >
      Resume
      <span className="visually-hidden">
        {/.pdf$/i.test(resume.fileName) ? " (PDF, opens in a new tab)" : " (opens in a new tab)"}
      </span>
    </a>
  );
}
