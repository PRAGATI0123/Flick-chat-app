"use client";

import { useEffect, useId, type ReactNode } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

/**
 * A popup in the middle of the screen with a dark background behind it.
 * Closes on Escape or a click on the dark background.
 * Only render it while it's open: {open && <Modal ... />}
 */
export function Modal({ title, onClose, children }: ModalProps) {
  const titleId = useId();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // createPortal puts the popup directly in <body>, so it's never cut off or
  // hidden behind other parts of the page.
  return createPortal(
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 text-foreground shadow-xl"
        onClick={(event) => event.stopPropagation()} // clicks inside shouldn't close it
      >
        <h2 id={titleId} className="text-lg font-semibold">
          {title}
        </h2>
        {children}
      </div>
    </div>,
    document.body,
  );
}
