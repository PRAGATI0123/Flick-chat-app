"use client";

import { useRouter } from "next/navigation";
import { ActionPopover } from "@/components/ActionPopover";
import { useChatStore } from "@/components/ChatStore";
import { ListRow } from "@/components/ListRow";
import { PageHeader } from "@/components/PageHeader";
import { StateView } from "@/components/StateView";

export default function DirectMessagesPage() {
  const router = useRouter();
  const { me, dmMessages, unread, isBlocked } = useChatStore();

  // One row per person you've chatted with, newest first. Blocked people are left out.
  const conversations = Object.entries(dmMessages)
    .filter(([username, messages]) => messages.length > 0 && username !== me && !isBlocked(username))
    .map(([username, messages]) => ({ username, last: messages[messages.length - 1] }));

  function startConversation(input: string) {
    const username = input.replace(/^@/, "");
    if (!/^[A-Za-z0-9_]{3,32}$/.test(username)) return "Use 3–32 letters, numbers or underscores.";
    if (username === me) return "You can't message yourself.";
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
            label="+ New message"
            prefix="@"
            placeholder="username"
            submitLabel="Open chat"
            onSubmit={startConversation}
          />
        }
      />

      <div className="p-6">
        {conversations.length === 0 ? (
          <StateView title="No conversations yet" description="Start one with “+ New message”." />
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
            {conversations.map(({ username, last }) => (
              <ListRow
                key={username}
                href={`/chat/directMsg/${username}`}
                title={`@${username}`}
                // Your own last message starts with "You:"
                subtitle={`${last.sender === me ? "You: " : ""}${last.body} · ${last.time}`}
                badge={unread[username]}
              />
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
