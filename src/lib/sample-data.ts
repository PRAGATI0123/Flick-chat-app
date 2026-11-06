// The last bits of placeholder code. All chat data (rooms, messages, DMs, blocks) now
// comes from the real API; the next step moves these two out and deletes this file.

/** What a chat bubble needs (made from a server message by toChatMessage in format.ts). */
export type Message = { id: number; sender: string; body: string; day: string; time: string };

// The old placeholder "you". No real data uses it anymore.
export const ME = "pragati_123";
