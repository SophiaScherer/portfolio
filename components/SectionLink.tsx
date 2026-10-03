"use client";

import type { ComponentProps } from "react";
import { usePathname } from "next/navigation";
import { sectionHref } from "../lib/links";

type SectionLinkProps = Omit<ComponentProps<"a">, "href"> & { id: string };

/**
 * Link to a home-page section. A bare `#id` on the home page keeps the jump
 * in-document (and keeps any query string); elsewhere it goes to `/#id`.
 */
export default function SectionLink({ id, ...props }: SectionLinkProps) {
  const onHome = usePathname() === "/";
  return <a href={onHome ? `#${id}` : sectionHref(id)} {...props} />;
}
