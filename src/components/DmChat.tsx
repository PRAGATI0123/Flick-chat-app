"use client";

import Link from "next/link";
import { useState } from "react";
import { useDmChat } from "@/hooks/useDmChat";
import { toChatMessage } from "@/lib/format";
import { Button } from "./Button";
import { ChatView } from "./ChatView";
import { useChatStore } from "./ChatStore";
import { BlockConfirmDialog } from "./ConfirmDialog";
import { PageHeader } from "./PageHeader";
import { StateView } from "./StateView";
import { useToast } from "./Toast";

const BACK = "/chat/directMsg";

/** A direct-message chat with one person (the full page), from the real API. */
export function DmChat({ username }: { username: string }) {
  const { myName, isBlocked, isMe, block, unblock } = useChatStore();
  const showToast = useToast();
  const [confirmingBlock, setConfirmingBlock] = useState(false);

  const itsYou = isMe(username);
  // Messages + polling + send for this person (skipped when it's you).
  const { messages, status, send, retry } = useDmChat(username, !itsYou);

  if (itsYou) {
    return (
      <>
        <PageHeader title="That's you!" backHref={BACK} />
        <StateView title="That's you!" description="You can't send a direct message to yourself." />
      </>
    );
  }

  const header = (withBlockButton: boolean) => (
    <PageHeader
      title={`Chat with @${username}`}
      description="Direct message"
      backHref={BACK}
      action={
        withBlockButton && (
          <Button variant="secondary" onClick={() => setConfirmingBlock(true)}>
            Block
          </Button>
        )
      }
    />
  );

  let body;
  if (isBlocked(username) || status === "blocked") {
    // 403 from the server: one of you blocked the other, so the whole chat is hidden.
    body = (
      <StateView
        title="This conversation is not available"
        description={
          isBlocked(username)
            ? `You blocked @${username}. Unblock them to see this chat again.`
            : "One of you has blocked the other."
        }
        action={
          isBlocked(username) && (
            <Link href="/chat/block" className="text-sm font-medium text-accent hover:underline">
              Go to Blocked users
            </Link>
          )
        }
      />
    );
  } else if (status === "gone") {
    // 404 from the server: no such user (guests are deleted after 24h without activity).
    body = (
      <StateView
        title={`@${username} isn't here anymore`}
        description="Guests are removed after 24 hours without activity."
      />
    );
  } else if (status === "loading") {
    body = <StateView title="Loading messages…" />;
  } else if (status === "error") {
    body = (
      <StateView
        title="Couldn't load messages"
        description="Check your internet connection and try again."
        action={
          <Button variant="secondary" onClick={() => retry()}>
            Try again
          </Button>
        }
      />
    );
  } else {
    body = (
      <ChatView
        messages={messages.map(toChatMessage)}
        me={myName ?? ""}
        onSend={send}
        placeholder={`Message @${username}…`}
        dmWith={username}
      />
    );
  }

  return (
    <>
      {header(status === "ready" && !isBlocked(username))}
      {body}

      {confirmingBlock && (
        <BlockConfirmDialog
          username={username}
          onConfirm={() => {
            block(username);
            setConfirmingBlock(false);
            showToast({ message: `@${username} blocked`, actionLabel: "Undo", onAction: () => unblock(username) });
          }}
          onCancel={() => setConfirmingBlock(false)}
        />
      )}
    </>
  );
}
