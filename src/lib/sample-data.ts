// The last bits of placeholder data. Rooms, room messages and DMs now come from the
// real API; the blocked list follows in the next step, and then this file goes away.

/** What a chat bubble needs (made from a server message by toChatMessage in format.ts). */
export type Message = { id: number; sender: string; body: string; day: string; time: string };

// Inside the remaining sample data, this name is "you".
export const ME = "pragati_123";

export const BLOCKED_USERS = [{ username: "user_4", blocked_at: "Today, 08:00" }];
