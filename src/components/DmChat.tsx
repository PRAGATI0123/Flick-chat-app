"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "./Button";
import { ChatView } from "./ChatView";
import { useChatStore, useReadingDm } from "./ChatStore";
import { BlockConfirmDialog } from "./ConfirmDialog";
import { PageHeader } from "./PageHeader";
import { StateView } from "./StateView";
import { useToast } from "./Toast";

const BACK = "/chat/directMsg";

/** A direct-message chat with one person (the full page). */
export function DmChat({ username }: { username: string }) {
  const { me, dmMessages, isBlocked, isMe, sendDm, block, unblock } = useChatStore();
  const showToast = useToast();
  const [confirmingBlock, setConfirmingBlock] = useState(false);

  // While this chat is on screen, its messages count as read (no unread badge).
  useReadingDm(username);

  if (isMe(username)) {
    return (
      <>
        <PageHeader title="That's you!" backHref={BACK} />
        <StateView title="That's you!" description="You can't send a direct message to yourself." />
      </>
    );
  }

  if (isBlocked(username)) {
    return (
      <>
        <PageHeader title={`Chat with @${username}`} backHref={BACK} />
        <StateView
          title="This conversation is not available"
          description={`You blocked @${username}. Unblock them to see this chat again.`}
          action={
            <Link href="/chat/block" className="text-sm font-medium text-accent hover:underline">
              Go to Blocked users
            </Link>
          }
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={`Chat with @${username}`}
        description="Direct message"
        backHref={BACK}
        action={
          <Button variant="secondary" onClick={() => setConfirmingBlock(true)}>
            Block
          </Button>
        }
      />
      <ChatView
        messages={dmMessages[username] ?? []}
        me={me}
        onSend={(body) => sendDm(username, body)}
        placeholder={`Message @${username}…`}
        dmWith={username}
      />

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
