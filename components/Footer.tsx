import { EXTERNAL_LINK_PROPS, SOCIAL_LINKS } from "../lib/links";
import { PROFILE } from "../lib/profile";
import SectionLink from "./SectionLink";

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <SectionLink id="about" className="footer-logo">
          {PROFILE.name}
          <span className="footer-copy">
            {" "}© {new Date().getFullYear()}
          </span>
        </SectionLink>
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
