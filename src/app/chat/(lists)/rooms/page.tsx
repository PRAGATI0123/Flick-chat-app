"use client";

import { useState } from "react";
import { ActionPopover } from "@/components/ActionPopover";
import { useChatStore } from "@/components/ChatStore";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ListRow } from "@/components/ListRow";
import { PageHeader } from "@/components/PageHeader";
import { StateView } from "@/components/StateView";

export default function RoomsPage() {
  const { me, rooms, createRoom, deleteRoom } = useChatStore();
  // The room waiting for "are you sure?" (null = no popup).
  const [roomToDelete, setRoomToDelete] = useState<{ id: number; name: string } | null>(null);

  return (
    <>
      <PageHeader
        title="Rooms"
        description="Rooms with no new messages for 24 hours are removed automatically."
        action={
          <ActionPopover
            label="+ Create room"
            prefix="#"
            placeholder="Room name"
            submitLabel="Create"
            onSubmit={createRoom}
          />
        }
      />

      <div className="p-6">
        {rooms.length === 0 ? (
          <StateView title="No rooms yet" description="Create the first one with “+ Create room”." />
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
            {rooms.map((room) => {
              const mine = room.created_by === me;
              return (
                <ListRow
                  key={room.id}
                  href={`/chat/rooms/${room.id}`}
                  icon="#"
                  title={room.name}
                  subtitle={mine ? "Created by you" : `Created by @${room.created_by}`}
                  // Only the person who created a room can delete it.
                  action={
                    mine && (
                      <button
                        type="button"
                        onClick={() => setRoomToDelete(room)}
                        className="rounded-lg px-3 py-1.5 text-sm text-red-500 hover:bg-red-500/10"
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
          message="The room and all of its messages will be deleted for everyone. This can't be undone."
          confirmLabel="Delete room"
          onConfirm={() => {
            deleteRoom(roomToDelete.id);
            setRoomToDelete(null);
          }}
          onCancel={() => setRoomToDelete(null)}
        />
      )}
    </>
  );
}
