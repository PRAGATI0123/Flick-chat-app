"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { BlockedIcon, CloseIcon, MessagesIcon } from "./icons";

type UserMenuProps = {
  username: string;
  /** Where the clicked name/avatar is on the screen; the menu opens next to it. */
  anchor: DOMRect;
  /** Hide "Direct message" when you are already in a DM with this person. */
  showDm: boolean;
  onDm: () => void;
  onBlock: () => void;
  onClose: () => void;
};

const MENU_WIDTH = 208;
const ITEM_CLASS = "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left hover:bg-surface-muted";

/**
 * Small dropdown menu under a username/avatar in a chat:
 * "Direct message" · "Block" · "Cancel".
 * Closes on Cancel, Escape, a click anywhere else, scrolling, or resizing the window.
 */
export function UserMenu({ username, anchor, showDm, onDm, onBlock, onClose }: UserMenuProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    // The menu is placed by screen position, so if the page moves, just close it.
    window.addEventListener("resize", onClose);
    window.addEventListener("scroll", onClose, true); // true = also scrolling inside the chat list
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onClose);
      window.removeEventListener("scroll", onClose, true);
    };
  }, [onClose]);

  // Open below the name; if there isn't room at the bottom of the screen, open above it.
  const menuHeight = showDm ? 172 : 134;
  const openUp = anchor.bottom + menuHeight + 8 > window.innerHeight;
  const top = openUp ? anchor.top - menuHeight - 4 : anchor.bottom + 4;
  // Don't go past the right edge of the screen (phones).
  const left = Math.max(8, Math.min(anchor.left, window.innerWidth - MENU_WIDTH - 8));

  // createPortal: draw it in <body> so the chat's scroll area can't cut it off.
  return createPortal(
    <>
      {/* Invisible layer over the page: a click anywhere outside the menu closes it */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        role="menu"
        aria-label={`Options for @${username}`}
        className="fixed z-50 rounded-xl border border-border bg-surface p-1 text-sm text-foreground shadow-xl"
        style={{ top, left, width: MENU_WIDTH }}
      >
        <p className="truncate px-3 pt-2 pb-1 text-xs text-muted">@{username}</p>
        {showDm && (
          <button type="button" role="menuitem" onClick={onDm} className={ITEM_CLASS} autoFocus>
            <MessagesIcon />
            Direct message
          </button>
        )}
        <button
          type="button"
          role="menuitem"
          onClick={onBlock}
          className={`${ITEM_CLASS} text-red-500`}
          autoFocus={!showDm}
        >
          <BlockedIcon />
          Block
        </button>
        <button type="button" role="menuitem" onClick={onClose} className={`${ITEM_CLASS} text-muted`}>
          <CloseIcon />
          Cancel
        </button>
      </div>
    </>,
    document.body,
  );
}
