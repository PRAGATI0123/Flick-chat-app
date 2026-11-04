// Placeholder data for the UI until the API is wired up.

export type Message = { id: number; sender: string; body: string; time: string };

export const ME = "pragati_123";

export const ROOMS = [
  { id: 1, name: "General", created_by: "cool_panda_42" },
  { id: 2, name: "Frontend Devs", created_by: "user_2" },
  { id: 3, name: "Random", created_by: "user_3" },
];

// Messages for each room, by room id.
export const ROOM_MESSAGES: Record<string, Message[]> = {
  "1": [
    { id: 1, sender: "cool_panda_42", body: "hey everyone!", time: "10:20" },
    { id: 2, sender: "user_2", body: "Hi!......", time: "10:22" },
    { id: 3, sender: ME, body: "Yeahhhh", time: "10:23" },
    { id: 4, sender: "user_3", body: "Nice", time: "10:25" },
  ],
  "2": [
    { id: 1, sender: "user_2", body: "Anyone tried the new Next.js version?", time: "09:10" },
    { id: 2, sender: ME, body: "Yes, using it for this chat app!", time: "09:12" },
  ],
  "3": [{ id: 1, sender: "user_3", body: "Random thought: chai > coffee ☕", time: "08:45" }],
};

export const DM_CONVERSATIONS = [
  { username: "cool_panda_42", last_message: "see you tomorrow!", time: "11:02" },
  { username: "user_2", last_message: "thanks for the help", time: "Yesterday" },
];

// Messages for each DM conversation, by the other person's username.
export const DM_MESSAGES: Record<string, Message[]> = {
  cool_panda_42: [
    { id: 1, sender: "cool_panda_42", body: "hi!", time: "10:58" },
    { id: 2, sender: ME, body: "hey?", time: "11:00" },
    { id: 3, sender: "cool_panda_42", body: "what's up?", time: "11:01" },
    { id: 4, sender: "cool_panda_42", body: "see you!", time: "11:02" },
  ],
  user_2: [
    { id: 1, sender: ME, body: "Fixed your bug, check now", time: "18:30" },
    { id: 2, sender: "user_2", body: "thanks for the help", time: "18:41" },
  ],
};

export const BLOCKED_USERS = [{ username: "user_4", blocked_at: "Today, 08:00" }];
