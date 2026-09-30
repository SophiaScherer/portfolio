import type { ReactNode } from "react";
import type { ResumeDownload } from "../lib/content";
import { EXTERNAL_LINK_PROPS } from "../lib/links";

type ResumeLinkProps = {
  resume: ResumeDownload;
  className: string;
  onClick?: () => void;
  children?: ReactNode;
};

/** Opens the CMS-hosted resume in a new tab, and says so to screen readers. */
export default function ResumeLink({
  resume,
  className,
  onClick,
  children = "Resume",
}: ResumeLinkProps) {
  const isPdf = /\.pdf$/i.test(resume.fileName);
  return (
    <a href={resume.url} {...EXTERNAL_LINK_PROPS} className={className} onClick={onClick}>
      {children}
      <span className="visually-hidden">
        {isPdf ? " (PDF, opens in a new tab)" : " (opens in a new tab)"}
      </span>
    </a>
  );
}
