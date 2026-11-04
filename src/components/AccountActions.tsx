"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useChatStore } from "./ChatStore";
import { ConfirmDialog } from "./ConfirmDialog";
import { NAV_ITEM_CLASS } from "./NavItem";

const BUTTON_CLASS = `${NAV_ITEM_CLASS} text-muted hover:text-foreground`;

/** Switches between light and dark, and remembers the choice in this browser. */
function toggleTheme() {
  const root = document.documentElement;
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {
    // Storage can be blocked (e.g. private mode); the switch still works for this visit.
  }
}

/** Theme switch + Log out (with "are you sure?"). Used in both sidebars. */
type AccountActionsProps = {
  className?: string;
  /** Small version for the phone top bar: icon-only theme button, side by side. */
  compact?: boolean;
};

export function AccountActions({ className = "", compact = false }: AccountActionsProps) {
  const router = useRouter();
  const { me } = useChatStore();
  const [confirmingLogout, setConfirmingLogout] = useState(false);

  return (
    <div className={`flex gap-1 ${compact ? "items-center" : "flex-col"} ${className}`}>
      <button
        type="button"
        onClick={toggleTheme}
        className={BUTTON_CLASS}
        aria-label={compact ? "Switch light/dark mode" : undefined}
      >
        {/* Both labels are in the page; CSS shows the right one for the current theme. */}
        <span className="dark:hidden">🌙{compact ? "" : " Dark mode"}</span>
        <span className="hidden dark:inline">☀️{compact ? "" : " Light mode"}</span>
      </button>

      <button type="button" onClick={() => setConfirmingLogout(true)} className={BUTTON_CLASS}>
        Log out
      </button>

      {confirmingLogout && (
        <ConfirmDialog
          title="Log out?"
          message={`There's no password, so you won't be able to sign back in as @${me}. You'll need to pick a username again.`}
          confirmLabel="Log out"
          // For now this just goes back to the start page; real logout comes with the API.
          onConfirm={() => router.push("/")}
          onCancel={() => setConfirmingLogout(false)}
        />
      )}
    </div>
  );
}
