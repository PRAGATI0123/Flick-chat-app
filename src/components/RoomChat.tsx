"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ApiError, getRoomMessages, sendRoomMessage, type Message } from "@/lib/api";
import { mergeMessages, pollAfter, toChatMessage } from "@/lib/format";
import { usePolling } from "@/hooks/usePolling";
import { Button } from "./Button";
import { ChatView } from "./ChatView";
import { useChatStore } from "./ChatStore";
import { PageHeader } from "./PageHeader";
import { StateView } from "./StateView";
import { useToast } from "./Toast";

const BACK = "/chat/rooms";

/** How often an open room asks the server for new messages (spec: 3–5 seconds). */
const POLL_MS = 4000;

/** Where this room's messages are: loading, loaded, room gone (404), or failed. */
type Status = "loading" | "ready" | "gone" | "error";

/** One room's chat: header + real messages from the server + message box. */
export function RoomChat({ id }: { id: string }) {
  const roomId = Number(id); // the URL gives text ("12"); the API wants a number
  const validId = Number.isInteger(roomId) && roomId > 0;
  const { myName, rooms, blocked, isBlocked, isMe, reloadRooms } = useChatStore();
  const showToast = useToast();
  const room = rooms.find((r) => r.id === roomId); // for the name in the header

  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<Status>(validId ? "loading" : "gone");

  // Get the latest 50 messages from the server. State changes only when the answer arrives.
  const loadMessages = useCallback(
    () =>
      getRoomMessages(roomId).then(
        (list) => {
          setMessages(list);
          setStatus("ready");
        },
        (error) => {
          if (error instanceof ApiError && error.status === 404) {
            setStatus("gone"); // the room was deleted (or removed after 24h without messages)
            reloadRooms(); // so it also disappears from the rooms list
          } else {
            setStatus("error");
          }
        },
      ),
    [roomId, reloadRooms],
  );

  // Load when the room opens, again if you switch to another room, and again when your
  // blocked list changes: after an unblock the server sends that person's messages again.
  useEffect(() => {
    if (validId) loadMessages();
  }, [validId, loadMessages, blocked]);

  // POLLING: every 4 seconds, while the room is open and loaded, ask
  // "any messages after the newest one I have?" and add what's new.
  async function checkForNewMessages() {
    try {
      const fresh = await getRoomMessages(roomId, pollAfter(messages));
      setMessages((current) => mergeMessages(current, fresh));
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        setStatus("gone"); // the room disappeared while you were in it
        reloadRooms();
      }
      // Any other problem (e.g. internet blip): stay quiet and try again next time.
    }
  }
  usePolling(checkForNewMessages, POLL_MS, status === "ready");

  /** Sends the message. Gives back false if it didn't go (the message box then keeps the text). */
  async function send(body: string) {
    try {
      const sent = await sendRoomMessage(roomId, body); // saved on the server
      // Add the server's copy (it has the real id and time). Polling may bring it too: no doubles.
      setMessages((current) => mergeMessages(current, [sent]));
      return true;
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        setStatus("gone");
        reloadRooms();
      } else {
        showToast({
          message: `Message not sent: ${error instanceof ApiError ? error.message : "please try again."}`,
        });
      }
      return false;
    }
  }

  const creator = !room
    ? undefined
    : !room.created_by
      ? "Created by a guest who has left"
      : isMe(room.created_by)
        ? "Created by you"
        : `Created by @${room.created_by}`;
  const header = <PageHeader title={`# ${room?.name ?? "Room"}`} description={creator} backHref={BACK} />;

  if (status === "gone") {
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

  if (status === "loading") {
    return (
      <>
        {header}
        <StateView title="Loading messages…" />
      </>
    );
  }

  if (status === "error") {
    return (
      <>
        {header}
        <StateView
          title="Couldn't load messages"
          description="Check your internet connection and try again."
          action={
            <Button variant="secondary" onClick={() => loadMessages()}>
              Try again
            </Button>
          }
        />
      </>
    );
  }

  // The server already leaves out messages from people you blocked; this also hides
  // anyone you block while the room is open.
  const bubbles = messages.filter((m) => !isBlocked(m.sender)).map(toChatMessage);

  return (
    <>
      {header}
      <ChatView messages={bubbles} me={myName ?? ""} onSend={send} placeholder="Message the room…" />
    </>
  );
}
