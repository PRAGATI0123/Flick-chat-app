"use client";

import { useSearchParams } from "next/navigation";

/** On the start page after a 401 ("/?ended=1"): tells you why you're back here. */
export function SessionEndedNote() {
  const ended = useSearchParams().get("ended") === "1";
  if (!ended) return null;

  return (
    <p role="status" className="w-full max-w-sm rounded-xl border border-border bg-surface-muted px-4 py-3 text-sm">
      Your session has ended. Guests are removed after 24 hours without activity. Pick a username to continue.
    </p>
  );
}
