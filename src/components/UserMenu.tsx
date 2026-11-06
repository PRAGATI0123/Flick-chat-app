"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDmChat } from "@/hooks/useDmChat";
import { toChatMessage } from "@/lib/format";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { ChatView } from "./ChatView";
import { useChatStore } from "./ChatStore";
import { BlockedIcon, CloseIcon, MessagesIcon } from "./icons";
import { StateView } from "./StateView";

/** What the card is showing right now. */
type Mode = "menu" | "confirmBlock" | "dm";

/** Size of each view (height is a rough guess for the small ones), used to fit it on the screen. */
const SIZES: Record<Mode, { width: number; height: number }> = {
  menu: { width: 224, height: 176 },
  confirmBlock: { width: 288, height: 176 },
  dm: { width: 340, height: 440 },
};

const ITEM_CLASS = "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left hover:bg-surface-muted";

type UserMenuProps = {
  username: string;
  /** Where the clicked name/avatar is on the screen; the card opens right next to it. */
  anchor: DOMRect;
  /** Hide "Direct message" when you are already in a DM with this person. */
  showDm: boolean;
  onClose: () => void;
};

/**
 * One small card that opens next to a clicked username/avatar in a chat, and changes in place:
 *   menu         → "Direct message" · "Block" · "Cancel"
 *   dm           → a mini chat with that person (you stay in the room)
 *   confirmBlock → "Block @name?" with Cancel / Block
 * Closes on Escape, a click outside, or (except the mini chat) scrolling the page.
 */
export function UserMenu({ username, anchor, showDm, onClose }: UserMenuProps) {
  const [mode, setMode] = useState<Mode>("menu");
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    const onScroll = (event: Event) => {
      if (mode === "dm") return; // the mini chat scrolls by itself; keep it open
      if (cardRef.current?.contains(event.target as Node)) return;
      onClose(); // the page moved, so the card would no longer be next to the name
    };
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onClose);
    window.addEventListener("scroll", onScroll, true); // true = also scrolling inside the chat list
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onClose);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [mode, onClose]);

  // Place the card right next to the name: below it if it fits, otherwise above it.
  // If it fits on neither side, use the side with more room and make it a bit shorter.
  const size = SIZES[mode];
  const width = Math.min(size.width, window.innerWidth - 16);
  const spaceBelow = window.innerHeight - anchor.bottom - 14; // 6px gap + 8px from the screen edge
  const spaceAbove = anchor.top - 14;
  const openBelow = size.height <= spaceBelow || (size.height > spaceAbove && spaceBelow >= spaceAbove);
  const height = Math.min(size.height, Math.max(openBelow ? spaceBelow : spaceAbove, 240));
  const top = openBelow
    ? Math.min(anchor.bottom + 6, window.innerHeight - 8 - height)
    : Math.max(8, anchor.top - 6 - height);
  const left = Math.max(8, Math.min(anchor.left, window.innerWidth - 8 - width));

  // createPortal: draw it in <body> so the chat's scroll area can't cut it off.
  return createPortal(
    <>
      {/* Invisible layer over the page: a click anywhere outside the card closes it */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        ref={cardRef}
        // key: changing view replays the small "pop in" animation
        key={mode}
        role={mode === "menu" ? "menu" : "dialog"}
        aria-label={mode === "dm" ? `Direct message with @${username}` : `Options for @${username}`}
        className="fixed z-50 flex flex-col overflow-hidden rounded-xl border border-border bg-surface text-sm text-foreground shadow-2xl motion-safe:animate-pop-in"
        style={{
          top,
          left,
          width,
          height: mode === "dm" ? height : undefined, // the mini chat needs a fixed height to scroll
          transformOrigin: openBelow ? "top left" : "bottom left", // grow out of the name
        }}
      >
        {mode === "menu" && (
          <MenuView
            username={username}
            showDm={showDm}
            onDm={() => setMode("dm")}
            onBlock={() => setMode("confirmBlock")}
            onClose={onClose}
          />
        )}
        {mode === "confirmBlock" && <ConfirmBlockView username={username} onClose={onClose} />}
        {mode === "dm" && <DmView username={username} onClose={onClose} />}
      </div>
    </>,
    document.body,
  );
}

/** Avatar + name at the top of the card. */
function CardHeader({ username, subtitle }: { username: string; subtitle?: string }) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2.5">
      <Avatar name={username} size="sm" />
      <div className="min-w-0">
        <p className="truncate font-semibold">@{username}</p>
        {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
      </div>
    </div>
  );
}

function MenuView({
  username,
  showDm,
  onDm,
  onBlock,
  onClose,
}: {
  username: string;
  showDm: boolean;
  onDm: () => void;
  onBlock: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <div className="flex border-b border-border px-3 py-2.5">
        <CardHeader username={username} />
      </div>
      <div className="p-1">
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
      </div>
      <div className="border-t border-border p-1">
        <button type="button" role="menuitem" onClick={onClose} className={`${ITEM_CLASS} text-muted`}>
          <CloseIcon />
          Cancel
        </button>
      </div>
    </>
  );
}

/** "Are you sure?" for blocking, shown inside the same card. */
function ConfirmBlockView({ username, onClose }: { username: string; onClose: () => void }) {
  const { block } = useChatStore();

  function confirm() {
    onClose();
    block(username); // on the server; shows "@name blocked · Undo" (or what went wrong)
  }

  return (
    <div className="p-4">
      <p className="font-semibold">Block @{username}?</p>
      <p className="mt-1 text-xs leading-5 text-muted">
        You won&apos;t see their messages in any room or in your DMs. You can unblock them later from Blocked users.
      </p>
      <div className="mt-4 flex justify-end gap-2">
        {/* autoFocus on Cancel, so pressing Enter by accident doesn't block */}
        <Button variant="secondary" onClick={onClose} autoFocus>
          Cancel
        </Button>
        <Button variant="danger" onClick={confirm}>
          Block
        </Button>
      </div>
    </div>
  );
}

/** A small chat with the person, right where you clicked; you stay in the room. */
function DmView({ username, onClose }: { username: string; onClose: () => void }) {
  const { myName } = useChatStore();
  // Real messages + polling + send for this person (also marks the chat as read while open).
  const { messages, status, send, retry } = useDmChat(username);

  return (
    <>
      <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
        <CardHeader username={username} subtitle="Direct message" />
        <Link
          href={`/chat/directMsg/${username}`}
          onClick={onClose}
          className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-accent hover:bg-surface-muted"
        >
          Open full chat
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="grid size-8 shrink-0 place-items-center rounded-lg text-muted hover:bg-surface-muted hover:text-foreground"
        >
          <CloseIcon />
        </button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col bg-background">
        {status === "ready" ? (
          <ChatView
            messages={messages.map(toChatMessage)}
            me={myName ?? ""}
            onSend={send}
            placeholder={`Message @${username}…`}
            dmWith={username}
            userMenu={false}
            autoFocus
          />
        ) : status === "loading" ? (
          <StateView title="Loading messages…" />
        ) : status === "blocked" ? (
          <StateView title="Not available" description="One of you has blocked the other." />
        ) : status === "gone" ? (
          <StateView title={`@${username} isn't here anymore`} description="Guests are removed after 24 hours without activity." />
        ) : (
          <StateView
            title="Couldn't load messages"
            action={
              <Button variant="secondary" onClick={() => retry()}>
                Try again
              </Button>
            }
          />
        )}
      </div>
    </>
  );
}
