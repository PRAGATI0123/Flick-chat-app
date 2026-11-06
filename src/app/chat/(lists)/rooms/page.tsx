"use client";

import { useCallback, useEffect, useState } from "react";
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
import { ApiError, getRoomMessages, type Message, type Room } from "@/lib/api";
import { matches, timeAgo } from "@/lib/format";
import { usePolling } from "@/hooks/usePolling";

/** How often the rooms list is refreshed while you look at it. */
const ROOMS_POLL_MS = 15_000;

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

  // POLLING: while you're on this page, refresh the list every 15 seconds, so rooms made
  // (or deleted) by other people show up without reloading. Rooms change less often than
  // messages, so this can be slower than the chat's 4 seconds.
  usePolling(reloadRooms, ROOMS_POLL_MS);

  // The newest message of each room (null = no messages yet). The rooms list from the
  // server doesn't include it, so we ask each room for its messages and keep the last one.
  const [lastMessages, setLastMessages] = useState<Record<number, Message | null>>({});

  const loadLastMessages = useCallback(
    () =>
      Promise.all(
        rooms.map((room) =>
          getRoomMessages(room.id).then(
            (list) => ({ id: room.id, last: list.at(-1) ?? null }),
            () => null, // couldn't load this room: keep what we had
          ),
        ),
      ).then((results) =>
        setLastMessages((current) => {
          const next = { ...current };
          for (const result of results) if (result) next[result.id] = result.last;
          return next;
        }),
      ),
    [rooms],
  );

  // Every time the rooms list arrives (on open, then every 15 seconds), get the last messages too.
  useEffect(() => {
    loadLastMessages();
  }, [loadLastMessages]);

  /** When something last happened in a room: its last message, or when it was created. */
  const lastActivity = (room: Room) => lastMessages[room.id]?.created_at ?? room.created_at;

  // Most recently active rooms first, then filtered by the search box.
  const visibleRooms = [...rooms]
    .sort((a, b) => lastActivity(b).localeCompare(lastActivity(a)))
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

  /** "You: hello" or "@amit: hello" (or "No messages yet") */
  function lastMessageText(room: Room) {
    const last = lastMessages[room.id];
    if (last === undefined) return "…"; // still loading
    if (last === null) return "No messages yet";
    return `${isMe(last.sender) ? "You" : `@${last.sender}`}: ${last.body}`;
  }

  /** "5 minutes ago" for the last message (nothing if the room has no messages). */
  function lastMessageTime(room: Room) {
    const last = lastMessages[room.id];
    return last ? timeAgo(last.created_at) : undefined;
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
                subtitle={lastMessageText(room)}
                meta={lastMessageTime(room)}
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
