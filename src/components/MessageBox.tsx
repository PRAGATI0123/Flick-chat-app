import Link from "next/link";
import { Avatar } from "./Avatar";

type MessageBoxProps = {
  sender: string;
  body: string;
  time: string;
  mine?: boolean;
};

export function MessageBox({ sender, body, time, mine = false }: MessageBoxProps) {
  return (
    <div className={`flex items-end gap-2 ${mine ? "flex-row-reverse" : ""}`}>
      {!mine && <Avatar name={sender} size="sm" />}
      <div className={`flex max-w-[75%] flex-col gap-1 ${mine ? "items-end" : "items-start"}`}>
        <div className="flex items-center gap-1 text-xs text-muted">
          {mine ? "You" : <UserMenu username={sender} />}
          <span>· {time}</span>
        </div>
        <p
          className={`rounded-2xl px-4 py-2 text-sm ${
            mine ? "bg-accent text-white" : "border border-border bg-surface"
          }`}
        >
          {body}
        </p>
      </div>
    </div>
  );
}

/** "@username" that shows Direct message / Block when you hover over it or click it. */
function UserMenu({ username }: { username: string }) {
  return (
    <div className="group relative">
      <button type="button" className="font-medium hover:text-foreground hover:underline">
        @{username}
      </button>
      {/* Hidden until hover or click (focus). pt-1 keeps hover alive in the gap. */}
      <div className="absolute left-0 top-full z-20 hidden pt-1 group-focus-within:block group-hover:block">
        <div className="flex w-44 flex-col rounded-lg border border-border bg-surface p-1 text-sm text-foreground shadow-lg">
          <Link href={`/chat/directMsg/${username}`} className="rounded-md px-3 py-2 hover:bg-surface-muted">
            Direct message
          </Link>
          {/* Blocking needs the API, so this button doesn't do anything yet. */}
          <button type="button" className="rounded-md px-3 py-2 text-left text-red-500 hover:bg-surface-muted">
            Block
          </button>
        </div>
      </div>
    </div>
  );
}
