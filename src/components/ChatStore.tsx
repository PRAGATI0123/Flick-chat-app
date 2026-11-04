"use client";

import { createContext, use, useCallback, useState, type ReactNode } from "react";
import {
  BLOCKED_USERS,
  DM_MESSAGES,
  ME,
  ROOMS,
  ROOM_MESSAGES,
  UNREAD,
  type Message,
} from "@/lib/sample-data";

/**
 * One shared place for all chat data, so every page sees the same thing:
 * a room you create shows up everywhere, a user you block disappears everywhere.
 *
 * It starts from the sample data and lives in memory, so a page reload resets it.
 * When the API is wired up, these functions will call the server instead.
 */

export type Room = { id: number; name: string; created_by: string };
type BlockedUser = { username: string; blocked_at: string };

type ChatStore = {
  me: string;
  rooms: Room[];
  roomMessages: Record<string, Message[]>;
  dmMessages: Record<string, Message[]>;
  blocked: BlockedUser[];
  unread: Record<string, number>;
  isBlocked: (username: string) => boolean;
  unreadTotal: number;
  /** Returns an error message, or nothing if it worked. */
  createRoom: (name: string) => string | void;
  deleteRoom: (id: number) => void;
  restoreRoom: (room: Room, messages: Message[], index: number) => void;
  sendToRoom: (roomId: string, body: string) => void;
  sendDm: (username: string, body: string) => void;
  block: (username: string) => void;
  unblock: (username: string) => void;
  markRead: (username: string) => void;
};

const ChatStoreContext = createContext<ChatStore | null>(null);

/** Current time as "HH:MM". */
function nowTime() {
  return new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function newMessage(list: Message[] | undefined, body: string): Message {
  return { id: (list?.at(-1)?.id ?? 0) + 1, sender: ME, body, day: "Today", time: nowTime() };
}

export function ChatStoreProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>(ROOMS);
  const [roomMessages, setRoomMessages] = useState(ROOM_MESSAGES);
  const [dmMessages, setDmMessages] = useState(DM_MESSAGES);
  const [blocked, setBlocked] = useState<BlockedUser[]>(BLOCKED_USERS);
  const [unread, setUnread] = useState(UNREAD);

  const isBlocked = (username: string) => blocked.some((b) => b.username === username);

  // Stable function (useCallback) because chat pages call it from an effect.
  const markRead = useCallback((username: string) => {
    // Return the same object when nothing changes, so React doesn't re-render.
    setUnread((current) => (current[username] ? { ...current, [username]: 0 } : current));
  }, []);

  const store: ChatStore = {
    me: ME,
    rooms,
    roomMessages,
    dmMessages,
    blocked,
    unread,
    isBlocked,
    unreadTotal: Object.entries(unread)
      .filter(([username]) => !isBlocked(username))
      .reduce((sum, [, count]) => sum + count, 0),

    createRoom(name) {
      if (rooms.some((room) => room.name.toLowerCase() === name.toLowerCase())) {
        return `A room called "${name}" already exists.`;
      }
      const id = Math.max(0, ...rooms.map((room) => room.id)) + 1;
      setRooms([{ id, name, created_by: ME }, ...rooms]);
    },

    deleteRoom(id) {
      setRooms((current) => current.filter((room) => room.id !== id));
      // Deleting a room deletes its messages too.
      setRoomMessages((current) => {
        const rest = { ...current };
        delete rest[String(id)];
        return rest;
      });
    },

    sendToRoom(roomId, body) {
      setRoomMessages((current) => ({
        ...current,
        [roomId]: [...(current[roomId] ?? []), newMessage(current[roomId], body)],
      }));
    },

    sendDm(username, body) {
      // Put this conversation first, so the DM list shows the most recent at the top.
      setDmMessages((current) => {
        const { [username]: existing = [], ...rest } = current;
        return { [username]: [...existing, newMessage(existing, body)], ...rest };
      });
    },

    restoreRoom(room, messages, index) {
      // Put it back where it was (used by "Undo" after deleting).
      setRooms((current) => [...current.slice(0, index), room, ...current.slice(index)]);
      setRoomMessages((current) => ({ ...current, [String(room.id)]: messages }));
    },

    block(username) {
      // Check inside the update, so it also works when called later (e.g. from "Undo").
      setBlocked((current) =>
        current.some((b) => b.username === username)
          ? current
          : [...current, { username, blocked_at: `Today, ${nowTime()}` }],
      );
    },

    unblock(username) {
      setBlocked((current) => current.filter((b) => b.username !== username));
    },

    markRead,
  };

  return <ChatStoreContext value={store}>{children}</ChatStoreContext>;
}

export function useChatStore() {
  const store = use(ChatStoreContext);
  if (!store) throw new Error("useChatStore must be used inside <ChatStoreProvider>");
  return store;
}
