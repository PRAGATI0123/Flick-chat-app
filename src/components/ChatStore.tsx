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
import { usePolling } from "@/hooks/usePolling";
import {
  ApiError,
  createRoom as apiCreateRoom,
  deleteRoom as apiDeleteRoom,
  getDmConversations,
  getDmMessages,
  getRooms,
  type DmConversation,
  type Room,
} from "@/lib/api";
import { readSessionName } from "@/lib/session";
import { BLOCKED_USERS, ME } from "@/lib/sample-data";

/**
 * One shared place for the chat data every page needs: the rooms list, your DM
 * conversations with their unread counts, and who you blocked.
 * (A room's or a DM's own messages live in that chat's screen instead.)
 */

type BlockedUser = { username: string; blocked_at: string };

/** Where a list is: still loading, loaded, or failed to load (with no list to show). */
export type LoadStatus = "loading" | "ready" | "error";

type ChatStore = {
  /** Who "you" are inside the remaining sample data (blocked list). */
  me: string;
  /** The name you logged in with (null for a moment while the page loads). */
  myName: string | null;
  /** Is this username you? */
  isMe: (username: string) => boolean;

  /** All rooms, from the real API. */
  rooms: Room[];
  roomsStatus: LoadStatus;
  /** Ask the server for the rooms list again. */
  reloadRooms: () => Promise<void>;
  /** Creates the room on the server. Gives back an error message, or nothing if it worked. */
  createRoom: (name: string) => Promise<string | void>;
  /** Deletes the room on the server. Throws an ApiError if the server says no (e.g. 403). */
  deleteRoom: (id: number) => Promise<void>;

  /** Everyone you've DMed with, most recent first, from the real API. */
  conversations: DmConversation[];
  dmStatus: LoadStatus;
  /** Ask the server for the conversations (and unread counts) again. */
  refreshDms: () => Promise<void>;
  /** How many messages from each person you haven't seen yet. */
  unread: Record<string, number>;
  unreadTotal: number;
  /** "I've seen this person's messages up to this time." Clears their badge. */
  markRead: (username: string, upTo?: string) => void;
  /** Whose DM is on screen right now (null = none), so their new messages don't count as unread. */
  setActiveDm: (username: string | null) => void;

  blocked: BlockedUser[];
  isBlocked: (username: string) => boolean;
  block: (username: string) => void;
  unblock: (username: string) => void;
};

const ChatStoreContext = createContext<ChatStore | null>(null);

/** How often the DM list and unread counts are refreshed, on every chat page. */
const DMS_POLL_MS = 8000;

/** Current time as "HH:MM". */
function nowTime() {
  return new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

/** An API time ("2026-11-06T10:15:00Z") as a number, so two times can be compared. */
const toMs = (iso: string) => Date.parse(iso);

// "Read up to" times are kept in this browser's storage (localStorage), per logged-in user:
// { "amit": "2026-11-06T10:15:00Z", … } = "I've seen amit's messages up to 10:15".
const readAtKey = (myName: string) => `dmReadAt:${myName}`;

function loadReadAt(myName: string | null): Record<string, string> {
  if (!myName) return {};
  try {
    return JSON.parse(localStorage.getItem(readAtKey(myName)) ?? "{}");
  } catch {
    return {}; // storage blocked (e.g. private mode): treat as nothing read yet
  }
}

function saveReadAt(myName: string, readAt: Record<string, string>) {
  try {
    localStorage.setItem(readAtKey(myName), JSON.stringify(readAt));
  } catch {
    // storage blocked: the badge just won't be remembered after a reload
  }
}

// The login cookie never changes while a page is open, so there is nothing to subscribe to.
const subscribeToNothing = () => () => {};

export function ChatStoreProvider({ children }: { children: ReactNode }) {
  // The cookie can only be read in the browser. On the server (and for the very first
  // moment in the browser) this is null, then React fills in the real name.
  const myName = useSyncExternalStore(subscribeToNothing, readSessionName, () => null);

  // ─── Rooms ────────────────────────────────────────────────────────────────
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

  // ─── Direct messages ─────────────────────────────────────────────────────
  const [conversations, setConversations] = useState<DmConversation[]>([]);
  const [dmStatus, setDmStatus] = useState<LoadStatus>("loading");
  const [unread, setUnread] = useState<Record<string, number>>({});

  // Whose DM is on screen right now. A ref, because the refresh below runs later from a
  // timer and needs the CURRENT value, not the one from when it was set up.
  const activeDmRef = useRef<string | null>(null);
  const setActiveDm = useCallback((username: string | null) => {
    activeDmRef.current = username;
  }, []);

  /**
   * Get your conversations, then work out the unread counts:
   * for each person whose LAST message is from them (not you) and newer than what you've
   * seen, ask for their messages after that time and count the ones they sent.
   */
  const refreshDms = useCallback(
    () =>
      getDmConversations().then(
        async (list) => {
          setConversations(list);
          setDmStatus("ready");

          const readAt = loadReadAt(myName);
          const counts: Record<string, number> = {};
          await Promise.all(
            list.map(async ({ username, last_message }) => {
              if (last_message.sender !== username) return; // the last message is yours → nothing new
              if (activeDmRef.current === username) return; // you're reading this chat right now
              const seenUpTo = readAt[username];
              if (seenUpTo && toMs(last_message.created_at) <= toMs(seenUpTo)) return; // already seen
              try {
                const messages = await getDmMessages(username, seenUpTo);
                counts[username] = messages.filter(
                  (m) => m.sender === username && (!seenUpTo || toMs(m.created_at) > toMs(seenUpTo)),
                ).length;
              } catch {
                // blocked or deleted in the meantime: no badge for them
              }
            }),
          );
          setUnread(counts);
        },
        // Failed: keep showing the list we have; only show the error screen when there's nothing.
        () => setDmStatus((current) => (current === "ready" ? "ready" : "error")),
      ),
    [myName],
  );

  // Load once when the chat part opens, then keep it fresh (this drives the unread badge).
  useEffect(() => {
    refreshDms();
  }, [refreshDms]);
  usePolling(refreshDms, DMS_POLL_MS);

  const markRead = useCallback(
    (username: string, upTo?: string) => {
      // Remember "seen up to this message" in the browser, so it survives a reload.
      if (upTo && myName) {
        const readAt = loadReadAt(myName);
        if (!readAt[username] || toMs(upTo) > toMs(readAt[username])) {
          readAt[username] = upTo;
          saveReadAt(myName, readAt);
        }
      }
      // Clear the badge now. (Returning the same object when nothing changes avoids a re-render.)
      setUnread((current) => (current[username] ? { ...current, [username]: 0 } : current));
    },
    [myName],
  );

  // ─── Blocking (still sample data; becomes real in the next step) ──────────
  const [blocked, setBlocked] = useState<BlockedUser[]>(BLOCKED_USERS);
  const isBlocked = (username: string) => blocked.some((b) => b.username === username);
  const isMe = (username: string) => username === ME || username === myName;

  const store: ChatStore = {
    me: ME,
    myName,
    isMe,

    rooms,
    roomsStatus,
    reloadRooms,

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

    conversations,
    dmStatus,
    refreshDms,
    unread,
    unreadTotal: Object.entries(unread)
      .filter(([username]) => !isBlocked(username))
      .reduce((sum, [, count]) => sum + count, 0),
    markRead,
    setActiveDm,

    blocked,
    isBlocked,
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
  };

  return <ChatStoreContext value={store}>{children}</ChatStoreContext>;
}

export function useChatStore() {
  const store = use(ChatStoreContext);
  if (!store) throw new Error("useChatStore must be used inside <ChatStoreProvider>");
  return store;
}

/**
 * Call this in a component that shows one person's DM (the DM page or the mini chat).
 * While it's on screen, that chat counts as read: the badge is cleared, the newest
 * message's time is remembered as "seen", and new messages don't add to the badge.
 */
export function useReadingDm(username: string, newestMessageTime?: string) {
  const { markRead, setActiveDm } = useChatStore();

  useEffect(() => {
    setActiveDm(username);
    return () => setActiveDm(null);
  }, [username, setActiveDm]);

  // When the chat opens, and again whenever a newer message shows up in it.
  useEffect(() => {
    markRead(username, newestMessageTime);
  }, [username, newestMessageTime, markRead]);
}
