"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Avatar } from "./Avatar";
import { ChatView } from "./ChatView";
import { useChatStore, useReadingDm } from "./ChatStore";
import { CloseIcon } from "./icons";
import { StateView } from "./StateView";

/**
 * A small chat popup with one person that opens ON TOP of the room you're in,
 * so you can message them without leaving it. Opened from a username's menu in a chat.
 * It doesn't cover the page: the room stays visible (and usable) behind it.
 */
export function QuickDmPanel() {
  const { quickDmUser, closeQuickDm } = useChatStore();
  if (!quickDmUser) return null;
  // key: switching to another person starts a fresh popup for them.
  return <Popup key={quickDmUser} username={quickDmUser} onClose={closeQuickDm} />;
}

function Popup({ username, onClose }: { username: string; onClose: () => void }) {
  const { me, dmMessages, isBlocked, sendDm } = useChatStore();

  // While the popup is open, this chat counts as read (replies won't add to the badge).
  useReadingDm(username);

  // Escape closes the popup, unless a popup or menu is open inside it (Escape closes that first).
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (document.querySelector('[role="dialog"], [role="menu"]')) return;
      onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <aside
      aria-label={`Direct message with @${username}`}
      // Phone: a card near the bottom with space around it (the room shows above it).
      // Tablet/desktop: a small window in the bottom-right corner, above the room's message box.
      className="fixed inset-x-3 bottom-20 z-40 flex h-[65dvh] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl md:inset-x-auto md:right-6 md:bottom-24 md:h-[460px] md:max-h-[calc(100dvh-8rem)] md:w-[360px]"
    >
      <header className="flex items-center gap-2.5 border-b border-border bg-surface px-3 py-2.5">
        <Avatar name={username} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">@{username}</p>
          <p className="text-xs text-muted">Direct message</p>
        </div>
        <Link
          href={`/chat/directMsg/${username}`}
          onClick={onClose}
          className="rounded-lg px-2 py-1 text-xs font-medium text-accent hover:bg-surface-muted"
        >
          Open full chat
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="grid size-8 place-items-center rounded-lg text-muted hover:bg-surface-muted hover:text-foreground"
        >
          <CloseIcon />
        </button>
      </header>

      {isBlocked(username) ? (
        <StateView
          title="This conversation is not available"
          description={`You blocked @${username}. Unblock them to chat again.`}
        />
      ) : (
        <ChatView
          messages={dmMessages[username] ?? []}
          me={me}
          onSend={(body) => sendDm(username, body)}
          placeholder={`Message @${username}…`}
          dmWith={username}
        />
      )}
    </aside>
  );
}
