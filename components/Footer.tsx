import { SOCIAL_LINKS } from "../lib/links";

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <a href="#about" className="footer-logo">
          Sophia Scherer
          <span className="footer-copy">
            {" "}© 2026
          </span>
        </a>
        <div className="footer-links">
          {SOCIAL_LINKS.map(({ label, href }) => (
            <a key={label} href={href}>
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
