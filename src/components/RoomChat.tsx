"use client";

import Link from "next/link";
import { ChatView } from "./ChatView";
import { useChatStore } from "./ChatStore";
import { PageHeader } from "./PageHeader";
import { StateView } from "./StateView";

const BACK = "/chat/rooms";

/** One room's chat: header + messages (without blocked users) + message box. */
export function RoomChat({ id }: { id: string }) {
  const { me, rooms, roomsStatus, roomMessages, isBlocked, isMe, sendToRoom } = useChatStore();
  const room = rooms.find((r) => String(r.id) === id);

  // The rooms list is still coming from the server (e.g. you opened this link directly).
  if (!room && roomsStatus === "loading") {
    return <PageHeader title="Loading…" backHref={BACK} />;
  }

  if (!room) {
    return (
      <>
        <PageHeader title="Room not found" backHref={BACK} />
        <StateView
          title="This room doesn't exist"
          description="It may have been deleted, or removed after 24 hours without messages."
          action={
            <Link href={BACK} className="text-sm font-medium text-accent hover:underline">
              Back to rooms
            </Link>
          }
        />
      </>
    );
  }

  // Messages are still the sample ones for now (the real ones come in the next step).
  // Messages from blocked users are hidden everywhere.
  const messages = (roomMessages[id] ?? []).filter((m) => !isBlocked(m.sender));

  const creator = !room.created_by
    ? "a guest who has left"
    : isMe(room.created_by)
      ? "you"
      : `@${room.created_by}`;

  return (
    <>
      <PageHeader title={`# ${room.name}`} description={`Created by ${creator}`} backHref={BACK} />
      <ChatView messages={messages} me={me} onSend={(body) => sendToRoom(id, body)} placeholder="Message the room…" />
    </>
  );
}
