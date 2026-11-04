import { Suspense } from "react";
import { Composer } from "@/components/Composer";
import { MessageList } from "@/components/MessageList";
import { PageHeader } from "@/components/PageHeader";
import { ME, ROOMS, ROOM_MESSAGES } from "@/lib/sample-data";

export default function RoomPage({ params }: PageProps<"/chat/rooms/[id]">) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* params are only known at request time, so they're read inside Suspense. */}
      <Suspense fallback={<PageHeader title="Loading…" />}>
        <RoomHeader params={params} />
      </Suspense>
      <MessageList messages={ROOM_MESSAGES} me={ME} />
      <Composer placeholder="Message the room…" />
    </div>
  );
}

async function RoomHeader({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const room = ROOMS.find((r) => String(r.id) === id);

  return (
    <PageHeader
      title={`# ${room?.name ?? `Room ${id}`}`}
      description={room ? `Created by @${room.created_by}` : undefined}
    />
  );
}
