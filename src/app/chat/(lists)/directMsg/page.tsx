"use client";

import { useRouter } from "next/navigation";
import { ActionPopover } from "@/components/ActionPopover";
import { ListRow } from "@/components/ListRow";
import { PageHeader } from "@/components/PageHeader";
import { StateView } from "@/components/StateView";
import { DM_CONVERSATIONS, ME } from "@/lib/sample-data";

export default function DirectMessagesPage() {
  const router = useRouter();

  function startConversation(input: string) {
    const username = input.replace(/^@/, "");
    if (!/^[A-Za-z0-9_]{3,32}$/.test(username)) return "Use 3–32 letters, numbers or underscores.";
    if (username === ME) return "You can't message yourself.";
    router.push(`/chat/directMsg/${username}`);
  }

  return (
    <>
      <PageHeader
        title="Direct messages"
        description="Your one-on-one conversations."
        action={
          <ActionPopover
            label="+ New message"
            prefix="@"
            placeholder="username"
            submitLabel="Open chat"
            onSubmit={startConversation}
          />
        }
      />

      <div className="p-6">
        {DM_CONVERSATIONS.length === 0 ? (
          <StateView title="No conversations yet" description="Messages you send or receive will show up here." />
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
            {DM_CONVERSATIONS.map((dm) => (
              <ListRow
                key={dm.username}
                href={`/chat/directMsg/${dm.username}`}
                title={`@${dm.username}`}
                subtitle={`${dm.last_message} · ${dm.time}`}
              />
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
