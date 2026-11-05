"use client";

import { useState } from "react";
import { ActionPopover } from "@/components/ActionPopover";
import { useChatStore, type Room } from "@/components/ChatStore";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { RoomsIcon } from "@/components/icons";
import { Input } from "@/components/Input";
import { ListRow } from "@/components/ListRow";
import { PageHeader } from "@/components/PageHeader";
import { StateView } from "@/components/StateView";
import { useToast } from "@/components/Toast";
import { matches, preview, shortWhen } from "@/lib/format";

export default function RoomsPage() {
  const { me, rooms, roomMessages, isBlocked, createRoom, deleteRoom, restoreRoom } = useChatStore();
  const showToast = useToast();
  const [query, setQuery] = useState("");
  // The room waiting for "are you sure?" (null = no popup).
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  const visibleRooms = rooms.filter((room) => matches(room.name, query));

  function handleCreate(name: string) {
    const problem = createRoom(name);
    if (problem) return problem;
    setQuery("");
    showToast({ message: `Room #${name} created` });
  }

  function handleDelete(room: Room) {
    // Remember the room, its messages and its place in the list, so "Undo" can put it back.
    const index = rooms.findIndex((r) => r.id === room.id);
    const messages = roomMessages[String(room.id)] ?? [];
    deleteRoom(room.id);
    setRoomToDelete(null);
    showToast({
      message: `Room #${room.name} deleted`,
      actionLabel: "Undo",
      onAction: () => restoreRoom(room, messages, index),
    });
  }

  return (
    <>
      <PageHeader
        title="Rooms"
        icon={<RoomsIcon className="size-5 md:size-6" />}
        description="Rooms with no new messages for 24 hours are removed automatically."
        action={
          <ActionPopover
            label="+ Create"
            prefix="#"
            placeholder="Room name"
            submitLabel="Create room"
            onSubmit={handleCreate}
          />
        }
      />

      <div className="flex flex-col gap-3 p-4 md:p-6">
        {rooms.length > 0 && (
          <Input
            type="search"
            aria-label="Search rooms"
            placeholder="Search rooms…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        )}

        {rooms.length === 0 ? (
          <StateView title="No rooms yet" description="Create the first one with “+ Create”." />
        ) : visibleRooms.length === 0 ? (
          <StateView title="No rooms found" description={`No room name contains “${query.trim()}”.`} />
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
            {visibleRooms.map((room) => {
              const mine = room.created_by === me;
              // Last message you can see (blocked users' messages are hidden).
              const last = (roomMessages[String(room.id)] ?? []).filter((m) => !isBlocked(m.sender)).at(-1);
              return (
                <ListRow
                  key={room.id}
                  href={`/chat/rooms/${room.id}`}
                  icon={<RoomsIcon className="size-5" />}
                  title={room.name}
                  subtitle={last ? preview(last, me, true) : mine ? "Created by you · no messages yet" : "No messages yet"}
                  meta={last ? shortWhen(last) : undefined}
                  // Only the person who created a room can delete it.
                  action={
                    mine && (
                      <button
                        type="button"
                        onClick={() => setRoomToDelete(room)}
                        className="rounded-lg px-2.5 py-1.5 text-sm text-red-500 hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    )
                  }
                />
              );
            })}
          </ul>
        )}
      </div>

      {roomToDelete && (
        <ConfirmDialog
          title={`Delete #${roomToDelete.name}?`}
          message="The room and all of its messages will be deleted for everyone."
          confirmLabel="Delete room"
          onConfirm={() => handleDelete(roomToDelete)}
          onCancel={() => setRoomToDelete(null)}
        />
      )}
    </>
  );
}
