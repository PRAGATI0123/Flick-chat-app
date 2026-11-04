import type { Message } from "./sample-data";

/** Short time for lists: "10:25" for today, otherwise the day ("Yesterday"). */
export function shortWhen(message: Message) {
  return message.day === "Today" ? message.time : message.day;
}

/** "You: hi" for your own message, "@user_3: hi" (or just "hi" in a DM) for others. */
export function preview(message: Message, me: string, showSender: boolean) {
  if (message.sender === me) return `You: ${message.body}`;
  return showSender ? `@${message.sender}: ${message.body}` : message.body;
}

/** Does the text contain what was typed in a search box? (ignores upper/lower case) */
export function matches(text: string, query: string) {
  return text.toLowerCase().includes(query.trim().toLowerCase());
}
