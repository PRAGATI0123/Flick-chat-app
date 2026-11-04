"use client";

import { useState } from "react";
import { ActionPopover } from "@/components/ActionPopover";
import { ListRow } from "@/components/ListRow";
import { PageHeader } from "@/components/PageHeader";
import { ME, ROOMS } from "@/lib/sample-data";

export default function RoomsPage() {
  // The list lives in this page's memory for now, so new rooms disappear on reload.
  const [rooms, setRooms] = useState(ROOMS);

  function createRoom(name: string) {
    if (rooms.some((room) => room.name.toLowerCase() === name.toLowerCase())) {
      return `A room called "${name}" already exists.`;
    }
    const id = Math.max(0, ...rooms.map((room) => room.id)) + 1;
    setRooms([{ id, name, created_by: ME }, ...rooms]);
  }

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
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
          {rooms.map((room) => (
            <ListRow
              key={room.id}
              href={`/chat/rooms/${room.id}`}
              icon="#"
              title={room.name}
              subtitle={room.created_by === ME ? "Created by you" : `Created by @${room.created_by}`}
            />
          ))}
        </ul>
      </div>
    </>
  );
}
