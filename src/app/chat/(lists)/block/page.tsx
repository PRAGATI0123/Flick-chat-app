"use client";

import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { useChatStore } from "@/components/ChatStore";
import { PageHeader } from "@/components/PageHeader";
import { StateView } from "@/components/StateView";

export default function BlockedUsersPage() {
  const { blocked, unblock } = useChatStore();

  return (
    <>
      <PageHeader title="Blocked users" description="You won't see messages from these users." />

      <div className="p-6">
        {blocked.length === 0 ? (
          <StateView title="No blocked users" description="People you block will appear here." />
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
            {blocked.map((user) => (
              <li key={user.username} className="flex items-center gap-3 px-4 py-3">
                <Avatar name={user.username} />
                <span className="flex flex-1 flex-col">
                  <span className="font-medium">@{user.username}</span>
                  <span className="text-sm text-muted">Blocked {user.blocked_at}</span>
                </span>
                {/* Their old and new messages show up again right away. */}
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
