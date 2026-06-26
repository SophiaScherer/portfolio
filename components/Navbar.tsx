"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { useNavActive } from "../hooks/useNavActive";
import { useHamburger } from "../hooks/useHamburger";

type NavbarProps = {
  resume: { url: string; fileName: string } | null;
};

export default function Navbar({ resume }: NavbarProps) {
  useNavActive();
  const { toggle } = useHamburger();

  const resumeLink = resume ? (
    <a
      href={resume.url}
      target={"_blank"}
      rel={"noopener noreferrer"}
      download={resume.fileName}
      className="btn-primary"
      style={{ marginTop: "8px" }}
    >
      Resume
    </a>
  ) : null;

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
            {resumeLink}
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
        {resumeLink}
      </div>
    </>
  );
}
