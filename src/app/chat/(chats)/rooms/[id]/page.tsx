import { Suspense } from "react";
import { ChatView } from "@/components/ChatView";
import { PageHeader } from "@/components/PageHeader";
import { ME, ROOMS, ROOM_MESSAGES } from "@/lib/sample-data";

export default function RoomPage({ params }: PageProps<"/chat/rooms/[id]">) {
  // params are only known at request time, so they're read inside Suspense.
  return (
    <Suspense fallback={<PageHeader title="Loading…" />}>
      <Room params={params} />
    </Suspense>
  );
}

async function Room({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const room = ROOMS.find((r) => String(r.id) === id);

  return (
    <>
      <PageHeader
        title={`# ${room?.name ?? `Room ${id}`}`}
        description={room ? `Created by @${room.created_by}` : undefined}
      />
      {/* key: a different room means a fresh chat with that room's messages */}
      <ChatView key={id} initialMessages={ROOM_MESSAGES[id] ?? []} me={ME} placeholder="Message the room…" />
    </>
  );
}
