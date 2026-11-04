"use client";

import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { useChatStore } from "@/components/ChatStore";
import { PageHeader } from "@/components/PageHeader";
import { StateView } from "@/components/StateView";
import { useToast } from "@/components/Toast";

export default function BlockedUsersPage() {
  const { blocked, block, unblock } = useChatStore();
  const showToast = useToast();

  function handleUnblock(username: string) {
    unblock(username); // their old and new messages show up again right away
    showToast({ message: `@${username} unblocked`, actionLabel: "Undo", onAction: () => block(username) });
  }

  return (
    <>
      <PageHeader title="Blocked users" description="You won't see messages from these users." />

      <div className="p-4 md:p-6">
        {blocked.length === 0 ? (
          <StateView title="No blocked users" description="People you block will appear here." />
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
            {blocked.map((user) => (
              <li key={user.username} className="flex items-center gap-3 px-4 py-3">
                <Avatar name={user.username} />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-medium">@{user.username}</span>
                  <span className="truncate text-sm text-muted">Blocked {user.blocked_at}</span>
                </span>
                <Button variant="secondary" onClick={() => handleUnblock(user.username)}>
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
