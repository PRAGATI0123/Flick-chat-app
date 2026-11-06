"use client";

import { useEffect, useState } from "react";
import { ActionPopover } from "@/components/ActionPopover";
import { Button } from "@/components/Button";
import { useChatStore } from "@/components/ChatStore";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { RoomsIcon } from "@/components/icons";
import { Input } from "@/components/Input";
import { ListRow } from "@/components/ListRow";
import { PageHeader } from "@/components/PageHeader";
import { StateView } from "@/components/StateView";
import { useToast } from "@/components/Toast";
import { ApiError, type Room } from "@/lib/api";
import { matches, timeAgo } from "@/lib/format";

export default function RoomsPage() {
  const { rooms, roomsStatus, reloadRooms, isMe, createRoom, deleteRoom } = useChatStore();
  const showToast = useToast();
  const [query, setQuery] = useState("");
  // The room waiting for "are you sure?" (null = no popup).
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  // Every time this page opens, ask the server again: someone else may have made a new room.
  useEffect(() => {
    reloadRooms();
  }, [reloadRooms]);

  // Newest rooms first, then filtered by the search box.
  const visibleRooms = [...rooms]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .filter((room) => matches(room.name, query));

  async function handleCreate(name: string) {
    const problem = await createRoom(name); // on the real server
    if (problem) return problem; // e.g. "A room with that name already exists." → shown in the box
    setQuery("");
    showToast({ message: `Room #${name} created` });
  }

  async function handleDelete(room: Room) {
    setRoomToDelete(null);
    try {
      await deleteRoom(room.id); // on the real server
      showToast({ message: `Room #${room.name} deleted` });
    } catch (error) {
      // e.g. 403 "Only the room's creator can delete it."
      showToast({ message: error instanceof ApiError ? error.message : "Couldn't delete the room. Try again." });
    }
  }

  /** "Created by you · 5 minutes ago" */
  function createdText(room: Room) {
    const who = !room.created_by
      ? "a guest who has left" // the creator was deleted after 24h without activity
      : isMe(room.created_by)
        ? "you"
        : `@${room.created_by}`;
    return `Created by ${who} · ${timeAgo(room.created_at)}`;
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
            busyLabel="Creating…"
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

        {roomsStatus === "loading" ? (
          <StateView title="Loading rooms…" />
        ) : roomsStatus === "error" ? (
          <StateView
            title="Couldn't load rooms"
            description="Check your internet connection and try again."
            action={
              <Button variant="secondary" onClick={() => reloadRooms()}>
                Try again
              </Button>
            }
          />
        ) : rooms.length === 0 ? (
          <StateView title="No rooms yet" description="Create the first one with “+ Create”." />
        ) : visibleRooms.length === 0 ? (
          <StateView title="No rooms found" description={`No room name contains “${query.trim()}”.`} />
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
            {visibleRooms.map((room) => (
              <ListRow
                key={room.id}
                href={`/chat/rooms/${room.id}`}
                icon={<RoomsIcon className="size-5" />}
                title={room.name}
                subtitle={createdText(room)}
                // Only the person who created a room can delete it.
                action={
                  room.created_by &&
                  isMe(room.created_by) && (
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
            ))}
          </ul>
        )}
      </div>

      {roomToDelete && (
        <ConfirmDialog
          title={`Delete #${roomToDelete.name}?`}
          message="The room and all of its messages will be deleted for everyone. This can't be undone."
          confirmLabel="Delete room"
          onConfirm={() => handleDelete(roomToDelete)}
          onCancel={() => setRoomToDelete(null)}
        />
      )}
    </>
  );
}
