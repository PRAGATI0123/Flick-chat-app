"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import type { Message } from "@/lib/sample-data";
import { useChatStore } from "./ChatStore";
import { BlockConfirmDialog } from "./ConfirmDialog";
import { MessageBox } from "./MessageBox";
import { useToast } from "./Toast";
import { UserMenu } from "./UserMenu";

/** How close (in pixels) to the bottom still counts as "at the bottom". */
const BOTTOM_SLACK = 80;

type MessageListProps = {
  messages: Message[];
  me: string;
  /** In a DM, the other person: their menu won't offer "Direct message" (you're already in it). */
  dmWith?: string;
};

export function MessageList({ messages, me, dmWith }: MessageListProps) {
  const { block, unblock, openQuickDm } = useChatStore();
  const showToast = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  // Is the list scrolled to the newest message? (a ref, because the scroll code below only reads it)
  const atBottomRef = useRef(true);
  const [atBottom, setAtBottom] = useState(true);
  // How many messages you had seen the last time you were at the bottom.
  const [seenCount, setSeenCount] = useState(messages.length);
  // The open dropdown menu: whose, and where on screen (null = closed).
  const [menu, setMenu] = useState<{ username: string; anchor: DOMRect } | null>(null);
  // Who is waiting for the "Block?" confirmation (null = no popup).
  const [blockTarget, setBlockTarget] = useState<string | null>(null);

  function scrollToBottom(smooth = false) {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  }

  // When a message is added: follow it if you were at the bottom or you sent it yourself.
  // If you scrolled up to read older messages, stay there and show the "New messages" button.
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (atBottomRef.current || last?.sender === me) scrollToBottom();
  }, [messages, me]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < BOTTOM_SLACK;
    atBottomRef.current = isAtBottom;
    setAtBottom(isAtBottom);
    if (isAtBottom) setSeenCount(messages.length);
  }

  function confirmBlock(username: string) {
    block(username);
    setBlockTarget(null);
    showToast({ message: `@${username} blocked`, actionLabel: "Undo", onAction: () => unblock(username) });
  }

  const hasNewMessages = !atBottom && messages.length > seenCount;

  return (
    // "relative" so the jump button can sit on top of the list
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div ref={scrollRef} onScroll={handleScroll} className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 md:p-6">
        {messages.map((m, i) => {
          const previous = messages[i - 1];
          const newDay = !previous || previous.day !== m.day;
          return (
            <Fragment key={m.id}>
              {/* Date line when the day changes: ——— Today ——— */}
              {newDay && (
                <div className="flex items-center gap-3 text-xs font-medium text-muted">
                  <span className="h-px flex-1 bg-border" />
                  {m.day}
                  <span className="h-px flex-1 bg-border" />
                </div>
              )}
              <MessageBox
                sender={m.sender}
                body={m.body}
                time={m.time}
                mine={m.sender === me}
                // New person, or a new day? Then show the name/avatar again.
                showHeader={newDay || previous.sender !== m.sender}
                // Name or avatar clicked → open the dropdown menu next to it
                onUserClick={(username, anchor) => setMenu({ username, anchor: anchor.getBoundingClientRect() })}
              />
            </Fragment>
          );
        })}
      </div>

      {/* Shown when you've scrolled up: jump back to the newest message */}
      {!atBottom && (
        <button
          type="button"
          onClick={() => scrollToBottom(true)}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium shadow-lg hover:bg-surface-muted"
        >
          ↓ {hasNewMessages ? "New messages" : "Latest"}
        </button>
      )}

      {menu && (
        <UserMenu
          username={menu.username}
          anchor={menu.anchor}
          showDm={menu.username !== dmWith}
          // Opens the DM panel on top of this page, so you stay in the room.
          onDm={() => {
            openQuickDm(menu.username);
            setMenu(null);
          }}
          onBlock={() => {
            setBlockTarget(menu.username);
            setMenu(null);
          }}
          onClose={() => setMenu(null)}
        />
      )}

      {blockTarget && (
        <BlockConfirmDialog
          username={blockTarget}
          onConfirm={() => confirmBlock(blockTarget)}
          onCancel={() => setBlockTarget(null)}
        />
      )}
    </div>
  );
}
