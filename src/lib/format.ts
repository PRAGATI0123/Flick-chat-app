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

const relativeTime = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/**
 * A time from the API ("2026-08-06T10:15:00Z") as "just now", "5 minutes ago", "yesterday"…
 * Call it in the browser only (it uses the current time).
 */
export function timeAgo(iso: string) {
  const seconds = Math.round((new Date(iso).getTime() - Date.now()) / 1000);
  if (Number.isNaN(seconds)) return "";
  if (Math.abs(seconds) < 45) return "just now";
  const minutes = Math.round(seconds / 60);
  if (Math.abs(minutes) < 60) return relativeTime.format(minutes, "minute");
  const hours = Math.round(seconds / 3600);
  if (Math.abs(hours) < 24) return relativeTime.format(hours, "hour");
  return relativeTime.format(Math.round(seconds / 86400), "day");
}

/** Does the text contain what was typed in a search box? (ignores upper/lower case) */
export function matches(text: string, query: string) {
  return text.toLowerCase().includes(query.trim().toLowerCase());
}
