"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ActionPopover } from "@/components/ActionPopover";
import { useChatStore } from "@/components/ChatStore";
import { Input } from "@/components/Input";
import { ListRow } from "@/components/ListRow";
import { PageHeader } from "@/components/PageHeader";
import { StateView } from "@/components/StateView";
import { matches, preview, shortWhen } from "@/lib/format";

export default function DirectMessagesPage() {
  const router = useRouter();
  const { me, dmMessages, unread, isBlocked, isMe } = useChatStore();
  const [query, setQuery] = useState("");

  // One row per person you've chatted with, newest first. Blocked people are left out.
  const conversations = Object.entries(dmMessages)
    .filter(([username, messages]) => messages.length > 0 && username !== me && !isBlocked(username))
    .map(([username, messages]) => ({ username, last: messages[messages.length - 1] }));

  const visible = conversations.filter(({ username }) => matches(username, query.replace(/^@/, "")));

  function startConversation(input: string) {
    const username = input.replace(/^@/, "");
    if (!/^[A-Za-z0-9_]{3,32}$/.test(username)) return "Use 3–32 letters, numbers or underscores.";
    if (isMe(username)) return "You can't message yourself.";
    if (isBlocked(username)) return `You blocked @${username}. Unblock them first.`;
    router.push(`/chat/directMsg/${username}`);
  }

  return (
    <>
      <PageHeader
        title="Direct messages"
        description="Your one-on-one conversations."
        action={
          <ActionPopover
            label="+ New"
            prefix="@"
            placeholder="username"
            submitLabel="Open chat"
            onSubmit={startConversation}
          />
        }
      />

      <div className="flex flex-col gap-3 p-4 md:p-6">
        {conversations.length > 0 && (
          <Input
            type="search"
            aria-label="Search conversations"
            placeholder="Search by username…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        )}

        {conversations.length === 0 ? (
          <StateView title="No conversations yet" description="Start one with “+ New”." />
        ) : visible.length === 0 ? (
          <StateView title="No conversations found" description={`No username contains “${query.trim()}”.`} />
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
            {visible.map(({ username, last }) => (
              <ListRow
                key={username}
                href={`/chat/directMsg/${username}`}
                title={`@${username}`}
                subtitle={preview(last, me, false)}
                meta={shortWhen(last)}
                badge={unread[username]}
              />
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
