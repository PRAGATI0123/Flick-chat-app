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
    // "group": the Copy/time bit appears when the mouse is over this message
    <div className={`group flex items-end gap-2 ${mine ? "flex-row-reverse" : ""} ${showHeader ? "" : "-mt-3"}`}>
      {/* Avatar only on the first message of a group; an empty box keeps the bubbles lined up */}
      {!mine && (showHeader ? <Avatar name={sender} size="sm" /> : <span className="size-8 shrink-0" />)}

      <div className={`flex max-w-[75%] flex-col gap-1 ${mine ? "items-end" : "items-start"}`}>
        {showHeader && (
          <div className="flex items-center gap-1 text-xs text-muted">
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
            <span>· {time}</span>
          </div>
        )}
        <p
          className={`rounded-2xl px-4 py-2 text-sm break-words ${
            mine ? "bg-accent text-white" : "border border-border bg-surface"
          }`}
        >
          {body}
        </p>
      </div>

      {/* Shown on hover (or keyboard focus): time for grouped messages + Copy */}
      <div className="flex items-center gap-2 self-center text-xs text-muted opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        {!showHeader && <span>{time}</span>}
        <button type="button" onClick={copy} className="rounded px-1.5 py-0.5 hover:bg-surface-muted hover:text-foreground">
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
