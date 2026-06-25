"use client";

import { useCallback, useEffect, useState } from "react";

export function useHamburger(closeOnSelector: string = ".mobile-menu a"): {
  open: boolean;
  toggle: () => void;
  close: () => void;
} {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen((o) => !o), []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobileMenu");
    if (!hamburger || !mobileMenu) return;

    hamburger.classList.toggle("open", open);
    mobileMenu.classList.toggle("open", open);
    mobileMenu.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  useEffect(() => {
    const links = document.querySelectorAll<HTMLAnchorElement>(closeOnSelector);
    const handler = () => close();
    links.forEach((l) => l.addEventListener("click", handler));
    return () => links.forEach((l) => l.removeEventListener("click", handler));
  }, [closeOnSelector, close]);

  return { open, toggle, close };
}
