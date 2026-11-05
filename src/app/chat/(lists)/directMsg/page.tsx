"use client";

import { useState } from "react";
import { useChatStore } from "@/components/ChatStore";
import { MessagesIcon } from "@/components/icons";
import { Input } from "@/components/Input";
import { ListRow } from "@/components/ListRow";
import { PageHeader } from "@/components/PageHeader";
import { StateView } from "@/components/StateView";
import { matches, preview, shortWhen } from "@/lib/format";

export default function DirectMessagesPage() {
  const { me, dmMessages, unread, isBlocked } = useChatStore();
  const [query, setQuery] = useState("");

  // One row per person you've chatted with, newest first. Blocked people are left out.
  const conversations = Object.entries(dmMessages)
    .filter(([username, messages]) => messages.length > 0 && username !== me && !isBlocked(username))
    .map(([username, messages]) => ({ username, last: messages[messages.length - 1] }));

  const visible = conversations.filter(({ username }) => matches(username, query.replace(/^@/, "")));

  return (
    <>
      <PageHeader
        title="Direct messages"
        icon={<MessagesIcon className="size-5 md:size-6" />}
        description="Your one-on-one conversations."
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
          <StateView
            title="No conversations yet"
            description="To start one, click someone's name in a room and choose “Direct message”."
          />
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
