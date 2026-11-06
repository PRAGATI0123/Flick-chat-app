"use client";

import { useEffect } from "react";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { useChatStore } from "@/components/ChatStore";
import { PageHeader } from "@/components/PageHeader";
import { StateView } from "@/components/StateView";
import { timeAgo } from "@/lib/format";

export default function BlockedUsersPage() {
  const { blocked, blockedStatus, reloadBlocked, unblock } = useChatStore();

  // Ask the server again whenever this page opens.
  useEffect(() => {
    reloadBlocked();
  }, [reloadBlocked]);

  return (
    <>
      <PageHeader title="Blocked users" description="You won't see messages from these users." />

      <div className="p-4 md:p-6">
        {blockedStatus === "loading" ? (
          <StateView title="Loading blocked users…" />
        ) : blockedStatus === "error" ? (
          <StateView
            title="Couldn't load blocked users"
            description="Check your internet connection and try again."
            action={
              <Button variant="secondary" onClick={() => reloadBlocked()}>
                Try again
              </Button>
            }
          />
        ) : blocked.length === 0 ? (
          <StateView title="No blocked users" description="People you block will appear here." />
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
            {blocked.map((user) => (
              <li key={user.username} className="flex items-center gap-3 px-4 py-3">
                <Avatar name={user.username} />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-medium">@{user.username}</span>
                  <span className="truncate text-sm text-muted">Blocked {timeAgo(user.blocked_at)}</span>
                </span>
                {/* On the server; their messages show up again. Shows "@name unblocked · Undo". */}
                <Button variant="secondary" onClick={() => unblock(user.username)}>
                  Unblock
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
