"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useNavActive } from "../hooks/useNavActive";
import { useHamburger } from "../hooks/useHamburger";

type NavbarProps = {
  resumeUrl: string;
  resumeFileName: string;
};

export default function Navbar({ resumeUrl, resumeFileName }: NavbarProps) {
  useNavActive();
  const { toggle } = useHamburger();

  return (
    <>
      <div className="nav-wrap">
        <nav className="nav">
          <a href="#about" className="nav-logo">
            Sophia Scherer
          </a>
          <ul className="nav-links">
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#projects">Projects</a>
            </li>
            <li>
              <a href="#experience">Experience</a>
            </li>
            <li>
              <a href="#interests">Interests</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
          <div className="nav-right">
            <ThemeToggle />
            <Link
                href={resumeUrl}
                download={resumeFileName}
                prefetch={false}
                className="btn-primary"
                style={{ marginTop: "8px" }}
            >
              Resume
            </Link>
            <button
              className="hamburger"
              id="hamburger"
              aria-label="Open menu"
              onClick={toggle}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>
      </div>

      <div className="mobile-menu" id="mobileMenu" aria-hidden="true">
        <a href="#about" className="mobile-link">
          About
        </a>
        <a href="#projects" className="mobile-link">
          Projects
        </a>
        <a href="#experience" className="mobile-link">
          Experience
        </a>
        <a href="#interests" className="mobile-link">
          Interests
        </a>
        <a href="#contact" className="mobile-link">
          Contact
        </a>
        <Link
            href={resumeUrl}
            download={resumeFileName}
            prefetch={false}
            className="btn-primary"
            style={{ marginTop: "8px" }}
        >
          Resume
        </Link>
      </div>
    </>
  );
}
