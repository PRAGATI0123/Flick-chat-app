"use client";

import { useState } from "react";
import { Avatar } from "./Avatar";

type MessageBoxProps = {
  sender: string;
  body: string;
  time: string;
  mine?: boolean;
  /** false for the 2nd, 3rd… message in a row from the same person: no name/avatar again. */
  showHeader?: boolean;
  /** Called when the @username is clicked. */
  onUserClick?: (username: string) => void;
};

export function MessageBox({ sender, body, time, mine = false, showHeader = true, onUserClick }: MessageBoxProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Copying can be blocked by the browser; nothing else to do.
    }
  }

  return (
    // "group": the Copy button appears when the mouse is over (or a finger taps) this message
    <div className={`group flex items-end gap-2 ${mine ? "flex-row-reverse" : ""} ${showHeader ? "" : "-mt-3"}`}>
      {/* Avatar only on the first message of a group; an empty box keeps the bubbles lined up */}
      {!mine && (showHeader ? <Avatar name={sender} size="sm" /> : <span className="size-8 shrink-0" />)}

      <div className={`flex max-w-[80%] min-w-0 flex-col gap-1 sm:max-w-[70%] ${mine ? "items-end" : "items-start"}`}>
        {showHeader && (
          <div className="text-xs text-muted">
            {mine ? (
              "You"
            ) : (
              <button
                type="button"
                onClick={() => onUserClick?.(sender)}
                className="font-medium hover:text-foreground hover:underline"
              >
                @{sender}
              </button>
            )}
          </div>
        )}
        <div
          className={`rounded-2xl px-3.5 py-2 text-sm ${
            mine ? "rounded-br-md bg-accent text-white" : "rounded-bl-md border border-border bg-surface"
          }`}
        >
          {/* whitespace-pre-wrap keeps line breaks; break-words stops long words overflowing */}
          <p className="break-words whitespace-pre-wrap">{body}</p>
          {/* Time on every message, bottom-right inside the bubble */}
          <span className={`mt-0.5 block text-right text-[11px] ${mine ? "text-white/70" : "text-muted"}`}>
            {time}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={copy}
        className="shrink-0 self-center rounded px-1.5 py-0.5 text-xs text-muted opacity-0 transition-opacity group-hover:opacity-100 hover:bg-surface-muted hover:text-foreground focus-visible:opacity-100"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
