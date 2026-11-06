// Placeholder data for the UI until the API is wired up.

// `day` is shown as a date line in the chat ("Yesterday", "Today").
// The real API gives a full timestamp (created_at); the day and time will be worked out from it.
export type Message = { id: number; sender: string; body: string; day: string; time: string };

// Inside the sample data, messages with sender ME are "yours" (shown as "You").
// The name you see on screen is the one you typed on the start page (src/lib/session.ts).
export const ME = "pragati_123";

// DEMO ONLY: there are no real people yet, so a DM you send gets an automatic reply
// after a few seconds (to show the unread count). Set to false to turn it off.
// Remove this when the API is wired up; real replies will come from the server.
export const DEMO_AUTO_REPLY = true;
export const DEMO_REPLIES = ["👍", "Haha, nice!", "Okay, got it.", "Sure, let's do it!", "Thanks! 🙂"];

// Messages for each DM conversation, by the other person's username.
// The DM list is built from this: newest conversation first, last message as the preview.
export const DM_MESSAGES: Record<string, Message[]> = {
  cool_panda_42: [
    { id: 1, sender: "cool_panda_42", body: "hi!", day: "Yesterday", time: "21:58" },
    { id: 2, sender: ME, body: "hey?", day: "Yesterday", time: "22:00" },
    { id: 3, sender: "cool_panda_42", body: "what's up?", day: "Today", time: "11:01" },
    { id: 4, sender: "cool_panda_42", body: "see you!", day: "Today", time: "11:02" },
  ],
  user_2: [
    { id: 1, sender: ME, body: "Fixed your bug, check now", day: "Yesterday", time: "18:30" },
    { id: 2, sender: "user_2", body: "thanks for the help", day: "Yesterday", time: "18:41" },
  ],
};

// How many DMs from each person you haven't read yet (shown as a badge).
export const UNREAD: Record<string, number> = { cool_panda_42: 2 };

export const BLOCKED_USERS = [{ username: "user_4", blocked_at: "Today, 08:00" }];
