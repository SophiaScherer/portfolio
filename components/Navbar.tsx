"use client";

import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#interests", label: "Interests" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = "";
  };

  return (
    <>
      <div className="nav-wrap">
        <nav className="nav">
          <a href="#about" className="nav-logo">
            Technical Scholar
          </a>

          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="nav-link"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav-right">
            <ThemeToggle />
            <a href="#" className="btn-resume">
              Resume
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(true);
                document.body.style.overflow = "hidden";
              }}
              className="hamburger"
              aria-label="Open menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div
        className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}
        aria-hidden={!mobileMenuOpen}
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={handleMobileLinkClick}
            className="mobile-link"
          >
            {link.label}
          </a>
        ))}
        <a
          href="#"
          onClick={handleMobileLinkClick}
          className="btn-primary"
          style={{ marginTop: "8px" }}
        >
          Resume
        </a>
      </div>
    </>
  );
}
