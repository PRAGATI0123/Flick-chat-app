"use client";

import Link from "next/link";
import { ChatView } from "./ChatView";
import { useChatStore } from "./ChatStore";
import { PageHeader } from "./PageHeader";
import { StateView } from "./StateView";

/** One room's chat: header + messages (without blocked users) + message box. */
export function RoomChat({ id }: { id: string }) {
  const { me, rooms, roomMessages, isBlocked, sendToRoom } = useChatStore();
  const room = rooms.find((r) => String(r.id) === id);

  if (!room) {
    return (
      <StateView
        title="This room doesn't exist"
        description="It may have been deleted, or removed after 24 hours without messages."
        action={<Link href="/chat/rooms" className="text-sm font-medium text-accent hover:underline">Back to rooms</Link>}
      />
    );
  }

  // Messages from blocked users are hidden everywhere.
  const messages = (roomMessages[id] ?? []).filter((m) => !isBlocked(m.sender));

  return (
    <>
      <PageHeader
        title={`# ${room.name}`}
        description={room.created_by === me ? "Created by you" : `Created by @${room.created_by}`}
      />
      <ChatView messages={messages} me={me} onSend={(body) => sendToRoom(id, body)} placeholder="Message the room…" />
    </>
  );
}
