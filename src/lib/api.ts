// The app's "phone book" for the chat API: one small function per thing the app can ask for.
// Pages call these (e.g. getRooms()) instead of writing fetch() themselves.
//
// Every function talks to OUR middleman at /api/… (src/app/api), which adds the hidden
// login token and forwards the request to the real chat API. So this file runs in the
// browser and never sees the token.

// ─── What the API sends back (the shapes from the spec, §4) ──────────────────

export type User = {
  username: string;
  created_at: string; // a time, like "2026-08-06T10:15:00Z"
};

/** You (GET /me): also when your 24-hour inactivity clock was last reset. */
export type Me = User & { last_active_at: string };

export type Room = {
  id: number;
  name: string;
  created_by: string | null; // null once the creator was deleted for inactivity
  created_at: string;
};

/** A message in a room (room_id set) or a DM (recipient set). */
export type Message = {
  id: number;
  sender: string;
  room_id: number | null;
  recipient: string | null;
  body: string;
  created_at: string;
};

/** One row in your DM list (GET /dm). */
export type DmConversation = {
  username: string;
  last_message: { body: string; sender: string; created_at: string };
};

export type BlockedUser = { username: string; blocked_at: string };

// ─── Errors ───────────────────────────────────────────────────────────────

/**
 * Thrown when a request fails. Has everything the page needs to react:
 *   status  → the number (401, 404, 409…; 0 = no internet)
 *   code    → the API's code, e.g. "USERNAME_TAKEN"
 *   message → a sentence you can show to the user
 */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ─── The one function that actually talks to the server ──────────────────

type RequestOptions = {
  method?: "GET" | "POST" | "DELETE";
  /** Sent as JSON, e.g. { body: "hello" } */
  body?: unknown;
};

/**
 * Sends a request to our middleman and returns the "data" part of the answer.
 * The API always answers { "data": … } when it worked, or { "error": { code, message } } when not.
 */
async function request<T>(path: string, { method = "GET", body }: RequestOptions = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api/${path}`, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store", // always ask for fresh data
    });
  } catch {
    // fetch itself failed: no internet, or our server is down.
    throw new ApiError(0, "NETWORK_ERROR", "Can't reach the server. Check your internet connection.");
  }

  const json = await response.json().catch(() => null); // a reply without JSON → null

  if (!response.ok) {
    throw new ApiError(
      response.status,
      json?.error?.code ?? "UNKNOWN_ERROR",
      json?.error?.message ?? `Something went wrong (${response.status}). Please try again.`,
    );
  }
  return json?.data as T;
}

/** Makes a value safe to put inside a URL (e.g. a username). */
const part = (value: string | number) => encodeURIComponent(String(value));

/** "?after=…" when there's a time, otherwise nothing. */
const query = (name: string, value?: string) => (value ? `?${name}=${part(value)}` : "");

// ─── Account (spec §2, §8) ───────────────────────────────────────────────────

/** Create a guest with this username. 409 = taken, 400 = not allowed. */
export const register = (username: string) => request<User>("register", { method: "POST", body: { username } });

/** Forget the login on this browser. */
export const logout = () => request<{ logged_out: true }>("logout", { method: "POST" });

/** Who am I? 401 = not logged in (or deleted after 24h without activity). */
export const getMe = () => request<Me>("me");

// ─── Rooms (spec §5) ─────────────────────────────────────────────────────────

export const getRooms = () => request<Room[]>("rooms");

/** 409 = a room with that name exists, 400 = empty name. */
export const createRoom = (name: string) => request<Room>("rooms", { method: "POST", body: { name } });

/** Only the creator may delete: 403 otherwise, 404 if already gone. */
export const deleteRoom = (id: number) =>
  request<{ id: number; deleted: true }>(`rooms/${part(id)}`, { method: "DELETE" });

/** Without `after`: the latest 50 messages. With `after` (a time): only newer ones (for polling). */
export const getRoomMessages = (roomId: number, after?: string) =>
  request<Message[]>(`rooms/${part(roomId)}/messages${query("after", after)}`);

export const sendRoomMessage = (roomId: number, body: string) =>
  request<Message>(`rooms/${part(roomId)}/messages`, { method: "POST", body: { body } });

// ─── Direct messages (spec §6) ──────────────────────────────────────────────

/** Everyone you've DMed with, most recent first. */
export const getDmConversations = () => request<DmConversation[]>("dm");

/** 403 = a block exists (either way), 404 = that user doesn't exist (anymore). */
export const getDmMessages = (username: string, after?: string) =>
  request<Message[]>(`dm/${part(username)}${query("after", after)}`);

/** 403 = blocked, 422 = that's you. */
export const sendDm = (username: string, body: string) =>
  request<Message>(`dm/${part(username)}`, { method: "POST", body: { body } });

/** How many DMs you received after this time (for the unread badge). */
export const getDmCountSince = (since: string) =>
  request<{ count: number; since: string }>(`dm/count${query("since", since)}`);

// ─── Blocking (spec §7) ──────────────────────────────────────────────────────

export const getBlockedUsers = () => request<BlockedUser[]>("blocks");

/** 422 = that's you, 404 = no such user. */
export const blockUser = (username: string) => request<BlockedUser>(`blocks/${part(username)}`, { method: "POST" });

export const unblockUser = (username: string) =>
  request<{ username: string; unblocked: true }>(`blocks/${part(username)}`, { method: "DELETE" });
