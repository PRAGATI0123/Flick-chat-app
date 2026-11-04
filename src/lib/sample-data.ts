// Placeholder data for the UI until the API is wired up.

export const ME = "cosmic_heron_55";

export const ROOMS = [
  { id: 1, name: "General", created_by: "cool_panda_42" },
  { id: 2, name: "Frontend Devs", created_by: "sunny_otter_17" },
  { id: 3, name: "Random", created_by: "brave_fox_88" },
];

export const ROOM_MESSAGES = [
  { id: 1, sender: "cool_panda_42", body: "hey everyone!", time: "10:20" },
  { id: 2, sender: "sunny_otter_17", body: "Hi! Anyone working on React today?", time: "10:22" },
  { id: 3, sender: ME, body: "Yep, building a chat app right now 🙂", time: "10:23" },
  { id: 4, sender: "brave_fox_88", body: "Nice, good luck!", time: "10:25" },
];

export const DM_CONVERSATIONS = [
  { username: "cool_panda_42", last_message: "see you tomorrow!", time: "11:02" },
  { username: "sunny_otter_17", last_message: "thanks for the help", time: "Yesterday" },
];

export const DM_MESSAGES = [
  { id: 1, sender: "cool_panda_42", body: "hi!", time: "10:58" },
  { id: 2, sender: ME, body: "hey, got a sec?", time: "11:00" },
  { id: 3, sender: "cool_panda_42", body: "sure, what's up?", time: "11:01" },
  { id: 4, sender: "cool_panda_42", body: "see you tomorrow!", time: "11:02" },
];

export const BLOCKED_USERS = [{ username: "noisy_user_1", blocked_at: "Today, 08:00" }];
