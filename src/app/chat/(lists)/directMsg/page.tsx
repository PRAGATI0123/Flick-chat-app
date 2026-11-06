"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { useChatStore } from "@/components/ChatStore";
import { MessagesIcon } from "@/components/icons";
import { Input } from "@/components/Input";
import { ListRow } from "@/components/ListRow";
import { PageHeader } from "@/components/PageHeader";
import { StateView } from "@/components/StateView";
import { matches, timeAgo } from "@/lib/format";

export default function DirectMessagesPage() {
  const { conversations, dmStatus, refreshDms, unread, isBlocked, isMe } = useChatStore();
  const [query, setQuery] = useState("");

  // Ask the server again whenever this page opens. (The list also refreshes every few
  // seconds on every chat page, for the unread badge.)
  useEffect(() => {
    refreshDms();
  }, [refreshDms]);

  // The server already sends them most recent first and leaves out blocked people.
  const visible = conversations
    .filter(({ username }) => !isBlocked(username))
    .filter(({ username }) => matches(username, query.replace(/^@/, "")));

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

        {dmStatus === "loading" ? (
          <StateView title="Loading conversations…" />
        ) : dmStatus === "error" ? (
          <StateView
            title="Couldn't load conversations"
            description="Check your internet connection and try again."
            action={
              <Button variant="secondary" onClick={() => refreshDms()}>
                Try again
              </Button>
            }
          />
        ) : conversations.length === 0 ? (
          <StateView
            title="No conversations yet"
            description="To start one, click someone's name in a room and choose “Direct message”."
          />
        ) : visible.length === 0 ? (
          <StateView title="No conversations found" description={`No username contains “${query.trim()}”.`} />
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
            {visible.map(({ username, last_message }) => (
              <ListRow
                key={username}
                href={`/chat/directMsg/${username}`}
                title={`@${username}`}
                // Your own last message starts with "You:"
                subtitle={`${isMe(last_message.sender) ? "You: " : ""}${last_message.body}`}
                meta={timeAgo(last_message.created_at)}
                badge={unread[username]}
              />
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
