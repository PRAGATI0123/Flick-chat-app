"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { clearSession } from "@/lib/session";
import { useChatStore } from "./ChatStore";
import { ConfirmDialog } from "./ConfirmDialog";
import { LogoutIcon, MoonIcon, SunIcon } from "./icons";
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

type AccountActionsProps = {
  className?: string;
  /** Small version for the phone top bar: icons only, side by side. */
  compact?: boolean;
};

/** Theme switch + Log out (with "are you sure?"). Used in the sidebars and the phone top bar. */
export function AccountActions({ className = "", compact = false }: AccountActionsProps) {
  const router = useRouter();
  const { myName } = useChatStore();
  const [confirmingLogout, setConfirmingLogout] = useState(false);

  async function logOut() {
    try {
      // Our server route deletes both cookies (the hidden token and your name).
      await fetch("/api/logout", { method: "POST" });
    } catch {
      // No internet: still forget the visible name here, so you land on the start page.
      clearSession();
    }
    router.replace("/"); // start page (replace: Back won't return to the chat)
  }

  return (
    <div className={`flex gap-1 ${compact ? "items-center" : "flex-col"} ${className}`}>
      <button
        type="button"
        onClick={toggleTheme}
        className={BUTTON_CLASS}
        aria-label={compact ? "Switch light/dark mode" : undefined}
      >
        {/* Both versions are in the page; CSS shows the right one for the current theme. */}
        <span className="flex items-center gap-2.5 dark:hidden">
          <MoonIcon />
          {!compact && "Dark mode"}
        </span>
        <span className="hidden items-center gap-2.5 dark:flex">
          <SunIcon />
          {!compact && "Light mode"}
        </span>
      </button>

      <button
        type="button"
        onClick={() => setConfirmingLogout(true)}
        className={BUTTON_CLASS}
        aria-label={compact ? "Log out" : undefined}
      >
        <LogoutIcon />
        {!compact && "Log out"}
      </button>

      {confirmingLogout && (
        <ConfirmDialog
          title="Log out?"
          message={`There's no password, so you won't be able to sign back in as @${myName ?? "this user"}. You'll need to pick a username again.`}
          confirmLabel="Log out"
          onConfirm={logOut}
          onCancel={() => setConfirmingLogout(false)}
        />
      )}
    </div>
  );
}
