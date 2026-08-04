"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";

/**
 * Controls that participate in the Tab cycle. Used to find where the cycle
 * wraps; disabled and explicitly un-tabbable elements are excluded.
 */
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

type Options = {
  open: boolean;
  onClose: () => void;
};

/**
 * Behaviour shared by any modal dialog: scroll lock, Escape to dismiss, and
 * full focus management (move in on open, trap while open, restore on close).
 *
 * Attach the returned ref to the element carrying `role="dialog"`. That element
 * needs `tabIndex={-1}` so it can receive focus itself — focus lands on the
 * container rather than the first control, so assistive tech announces the
 * dialog's accessible name before its contents.
 *
 * The dialog is expected to stay mounted while closed (so it can transition
 * out). Keeping it `visibility: hidden` in that state is what keeps its
 * contents out of the page's tab order.
 */
export function useModal<T extends HTMLElement = HTMLElement>({
  open,
  onClose,
}: Options): RefObject<T> {
  const dialogRef = useRef<T>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Callers pass an inline arrow function, so track the latest `onClose` in a
  // ref rather than re-binding the key listener on every render.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const getFocusable = useCallback(
    () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ??
          [],
      ),
    [],
  );

  // Lock body scroll, restoring whatever was there before. The value is
  // captured rather than reset to "" because `useHamburger` writes the same
  // property — neither should clobber the other.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Move focus into the dialog, and hand it back to whatever opened it.
  useEffect(() => {
    if (!open) return;

    const active = document.activeElement;
    triggerRef.current = active instanceof HTMLElement ? active : null;
    dialogRef.current?.focus();

    return () => {
      triggerRef.current?.focus();
      triggerRef.current = null;
    };
  }, [open]);

  // Escape to dismiss, and keep Tab inside the dialog.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = getFocusable();
      const active = document.activeElement;

      // Nothing to cycle through, or focus has drifted out of the dialog.
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      if (!(active instanceof HTMLElement) || !dialog.contains(active)) {
        event.preventDefault();
        focusable[0].focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      // Tabbing backwards off the front, or forwards off the end, wraps.
      if (event.shiftKey && (active === first || active === dialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, getFocusable]);

  return dialogRef;
}
