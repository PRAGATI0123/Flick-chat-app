import type { Message as ApiMessage } from "./api";
import type { Message } from "./sample-data";

/** "Today", "Yesterday", or a date like "6 Nov" (with the year if it's not this year). */
function dayLabel(date: Date) {
  const now = new Date();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const daysAgo = Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000);
  if (daysAgo === 0) return "Today";
  if (daysAgo === 1) return "Yesterday";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: date.getFullYear() === now.getFullYear() ? undefined : "numeric",
  });
}

/**
 * A message from the server → what a chat bubble needs.
 * The server's time ("2026-11-06T10:15:00Z", always UTC) becomes your local day + "HH:MM".
 * Call it in the browser only (it uses your time zone and today's date).
 */
export function toChatMessage(message: ApiMessage): Message {
  const date = new Date(message.created_at);
  return {
    id: message.id,
    sender: message.sender,
    body: message.body,
    day: dayLabel(date),
    time: date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
  };
}

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
