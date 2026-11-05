// Placeholder data for the UI until the API is wired up.

// `day` is shown as a date line in the chat ("Yesterday", "Today").
// The real API gives a full timestamp (created_at); the day and time will be worked out from it.
export type Message = { id: number; sender: string; body: string; day: string; time: string };

// Inside the sample data, messages with sender ME are "yours" (shown as "You").
// The name you see on screen is the one you typed on the start page (src/lib/session.ts).
export const ME = "pragati_123";

// Usernames already used by the sample people. Picking one on the start page shows
// "already taken", like the real API would.
export const TAKEN_USERNAMES = ["cool_panda_42", "user_2", "user_3", "user_4"];

// DEMO ONLY: there are no real people yet, so a DM you send gets an automatic reply
// after a few seconds (to show the unread count). Set to false to turn it off.
// Remove this when the API is wired up; real replies will come from the server.
export const DEMO_AUTO_REPLY = true;
export const DEMO_REPLIES = ["👍", "Haha, nice!", "Okay, got it.", "Sure, let's do it!", "Thanks! 🙂"];

export const ROOMS = [
  { id: 1, name: "General", created_by: "cool_panda_42" },
  { id: 2, name: "Frontend Devs", created_by: "user_2" },
  { id: 3, name: "Random", created_by: "user_3" },
];

// Messages for each room, by room id.
export const ROOM_MESSAGES: Record<string, Message[]> = {
  "1": [
    { id: 1, sender: "cool_panda_42", body: "hey everyone!", day: "Yesterday", time: "22:40" },
    { id: 2, sender: "user_2", body: "Hi!......", day: "Yesterday", time: "22:42" },
    { id: 3, sender: ME, body: "Yeahhhh", day: "Today", time: "10:23" },
    { id: 4, sender: "user_3", body: "Nice", day: "Today", time: "10:25" },
  ],
  "2": [
    { id: 1, sender: "user_2", body: "Anyone tried the new Next.js version?", day: "Today", time: "09:10" },
    { id: 2, sender: ME, body: "Yes, using it for this chat app!", day: "Today", time: "09:12" },
  ],
  "3": [{ id: 1, sender: "user_3", body: "Random thought: chai > coffee ☕", day: "Yesterday", time: "08:45" }],
};

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
