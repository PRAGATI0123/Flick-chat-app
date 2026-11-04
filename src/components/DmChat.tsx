"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./Button";
import { ChatView } from "./ChatView";
import { useChatStore } from "./ChatStore";
import { PageHeader } from "./PageHeader";
import { StateView } from "./StateView";
import { BlockConfirmDialog } from "./UserDialog";

/** A direct-message chat with one person. */
export function DmChat({ username }: { username: string }) {
  const { me, dmMessages, isBlocked, sendDm, block, markRead } = useChatStore();
  const [confirmingBlock, setConfirmingBlock] = useState(false);

  // Opening the chat means you've read their messages.
  useEffect(() => {
    markRead(username);
  }, [username, markRead]);

  if (username === me) {
    return <StateView title="That's you!" description="You can't send a direct message to yourself." />;
  }

  if (isBlocked(username)) {
    return (
      <>
        <PageHeader title={`Chat with @${username}`} />
        <StateView
          title="This conversation is not available"
          description={`You blocked @${username}. Unblock them to see this chat again.`}
          action={<Link href="/chat/block" className="text-sm font-medium text-accent hover:underline">Go to Blocked users</Link>}
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={`Chat with @${username}`}
        description="Direct message"
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
      />

      {confirmingBlock && (
        <BlockConfirmDialog
          username={username}
          onConfirm={() => {
            block(username);
            setConfirmingBlock(false);
          }}
          onCancel={() => setConfirmingBlock(false)}
        />
      )}
    </>
  );
}
