"use client";

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  ApiError,
  createRoom as apiCreateRoom,
  deleteRoom as apiDeleteRoom,
  getRooms,
  type Room,
} from "@/lib/api";
import { readSessionName } from "@/lib/session";
import {
  BLOCKED_USERS,
  DEMO_AUTO_REPLY,
  DEMO_REPLIES,
  DM_MESSAGES,
  ME,
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

type BlockedUser = { username: string; blocked_at: string };

/** Where the rooms list is: still loading, loaded, or failed to load (with no list to show). */
export type LoadStatus = "loading" | "ready" | "error";

type ChatStore = {
  /** Who "you" are inside the data (messages with this sender show as "You"). */
  me: string;
  /** The name you logged in with, for showing on screen (null for a moment while the page loads). */
  myName: string | null;
  /** All rooms, from the real API. */
  rooms: Room[];
  roomsStatus: LoadStatus;
  /** Ask the server for the rooms list again. */
  reloadRooms: () => Promise<void>;
  dmMessages: Record<string, Message[]>;
  blocked: BlockedUser[];
  unread: Record<string, number>;
  isBlocked: (username: string) => boolean;
  /** Is this username you? (works for both your data id and your login name) */
  isMe: (username: string) => boolean;
  unreadTotal: number;
  /** Creates the room on the server. Gives back an error message, or nothing if it worked. */
  createRoom: (name: string) => Promise<string | void>;
  /** Deletes the room on the server. Throws an ApiError if the server says no (e.g. 403). */
  deleteRoom: (id: number) => Promise<void>;
  sendDm: (username: string, body: string) => void;
  block: (username: string) => void;
  unblock: (username: string) => void;
  markRead: (username: string) => void;
  setActiveDm: (username: string | null) => void;
};

const ChatStoreContext = createContext<ChatStore | null>(null);

/** Current time as "HH:MM". */
function nowTime() {
  return new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function newMessage(list: Message[] | undefined, sender: string, body: string): Message {
  return { id: (list?.at(-1)?.id ?? 0) + 1, sender, body, day: "Today", time: nowTime() };
}

/** Adds a message to a DM and moves that conversation to the top of the list. */
function addDm(all: Record<string, Message[]>, username: string, sender: string, body: string) {
  const { [username]: existing = [], ...rest } = all;
  return { [username]: [...existing, newMessage(existing, sender, body)], ...rest };
}

// The login cookie never changes while a page is open, so there is nothing to subscribe to.
const subscribeToNothing = () => () => {};

export function ChatStoreProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomsStatus, setRoomsStatus] = useState<LoadStatus>("loading");

  // Get the rooms list from the real API. The state is only changed when the server's
  // answer arrives (inside .then), never straight away.
  const reloadRooms = useCallback(
    () =>
      getRooms().then(
        (list) => {
          setRooms(list);
          setRoomsStatus("ready");
        },
        // Failed: if we already have a list, keep showing it; only show the error screen when there's nothing.
        () => setRoomsStatus((current) => (current === "ready" ? "ready" : "error")),
      ),
    [],
  );

  // Load the rooms once when the chat part of the app opens.
  useEffect(() => {
    reloadRooms();
  }, [reloadRooms]);
  const [dmMessages, setDmMessages] = useState(DM_MESSAGES);
  const [blocked, setBlocked] = useState<BlockedUser[]>(BLOCKED_USERS);
  const [unread, setUnread] = useState(UNREAD);

  // The cookie can only be read in the browser. On the server (and for the very first
  // moment in the browser) this is null, then React fills in the real name.
  const myName = useSyncExternalStore(subscribeToNothing, readSessionName, () => null);

  // Whose DM is on screen right now (a DM page or the mini chat card). A ref, because replies
  // arrive later from a timer and need the CURRENT value, not the one from when it started.
  const activeDmRef = useRef<string | null>(null);
  const setActiveDm = useCallback((username: string | null) => {
    activeDmRef.current = username;
  }, []);

  // Stable function (useCallback) because chat pages call it from an effect.
  const markRead = useCallback((username: string) => {
    // Return the same object when nothing changes, so React doesn't re-render.
    setUnread((current) => (current[username] ? { ...current, [username]: 0 } : current));
  }, []);

  /** A message from someone else arrived in your DMs. */
  const receiveDm = useCallback((username: string, body: string) => {
    setDmMessages((current) => addDm(current, username, username, body));
    // Not looking at that chat right now? Then it's unread: +1 on the badge.
    if (activeDmRef.current !== username) {
      setUnread((current) => ({ ...current, [username]: (current[username] ?? 0) + 1 }));
    }
  }, []);

  // DEMO ONLY: pending auto-replies, so they can be cancelled if this page goes away.
  const replyTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => {
    const timers = replyTimers.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  const isBlocked = (username: string) => blocked.some((b) => b.username === username);
  const isMe = (username: string) => username === ME || username === myName;

  const store: ChatStore = {
    me: ME,
    myName,
    rooms,
    roomsStatus,
    reloadRooms,
    dmMessages,
    blocked,
    unread,
    isBlocked,
    isMe,
    unreadTotal: Object.entries(unread)
      .filter(([username]) => !isBlocked(username))
      .reduce((sum, [, count]) => sum + count, 0),

    async createRoom(name) {
      try {
        const room = await apiCreateRoom(name); // the server gives back the new room (with its id)
        setRooms((current) => [room, ...current.filter((r) => r.id !== room.id)]);
      } catch (error) {
        // 409 = a room with that name exists, 400 = empty name: show the server's sentence.
        return error instanceof ApiError ? error.message : "Couldn't create the room. Try again.";
      }
    },

    async deleteRoom(id) {
      try {
        await apiDeleteRoom(id);
      } catch (error) {
        // 404 = it was already gone (deleted, or removed after 24h): same result, so carry on.
        if (!(error instanceof ApiError && error.status === 404)) throw error;
      }
      setRooms((current) => current.filter((room) => room.id !== id));
    },

    sendDm(username, body) {
      setDmMessages((current) => addDm(current, username, ME, body));
      if (DEMO_AUTO_REPLY) {
        const reply = DEMO_REPLIES[Math.floor(Math.random() * DEMO_REPLIES.length)];
        replyTimers.current.push(setTimeout(() => receiveDm(username, reply), 2500));
      }
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
    setActiveDm,
  };

  return <ChatStoreContext value={store}>{children}</ChatStoreContext>;
}

export function useChatStore() {
  const store = use(ChatStoreContext);
  if (!store) throw new Error("useChatStore must be used inside <ChatStoreProvider>");
  return store;
}

/**
 * Call this in a component that shows one person's DM (the DM page or the mini chat card).
 * While it's on screen, that chat counts as "read": the badge is cleared, and
 * replies that arrive don't add to it.
 */
export function useReadingDm(username: string) {
  const { markRead, setActiveDm, dmMessages } = useChatStore();
  const messageCount = dmMessages[username]?.length ?? 0;

  useEffect(() => {
    setActiveDm(username);
    return () => setActiveDm(null);
  }, [username, setActiveDm]);

  // Clear the badge when the chat opens, and again whenever a new message arrives in it.
  useEffect(() => {
    markRead(username);
  }, [username, markRead, messageCount]);
}
