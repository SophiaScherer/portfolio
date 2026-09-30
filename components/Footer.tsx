import { EXTERNAL_LINK_PROPS, SOCIAL_LINKS, sectionHref } from "../lib/links";

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <a href={sectionHref("about")} className="footer-logo">
          Sophia Scherer
          <span className="footer-copy">
            {" "}© {new Date().getFullYear()}
          </span>
        </a>
        <div className="footer-links">
          {SOCIAL_LINKS.map(({ label, href }) => (
            <a key={label} href={href} {...EXTERNAL_LINK_PROPS}>
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
