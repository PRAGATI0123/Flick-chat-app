// Small helpers for our server routes in src/app/api (the "middleman" between the browser
// and the real chat API). Server only: the browser never sees the token.
import "server-only";
import { API_BASE_URL } from "./config";

/** Name of the cookie that holds the secret login token from the real API. */
export const TOKEN_COOKIE = "chat_token";

/** How the token cookie is stored. */
export const TOKEN_COOKIE_OPTIONS = {
  httpOnly: true, // JavaScript in the browser can't read it (safe from bad scripts)
  sameSite: "lax", // only sent with requests from our own site
  secure: process.env.NODE_ENV === "production", // HTTPS only on the real website
  path: "/", // sent with every request on this site
  maxAge: 60 * 60 * 24 * 30, // 30 days (the real API deletes idle guests after 24h anyway)
} as const;

/** Full address on the real API, e.g. apiUrl("rooms/12/messages", "?after=…"). */
export function apiUrl(path: string, search = ""): URL {
  const base = API_BASE_URL.endsWith("/") ? API_BASE_URL : `${API_BASE_URL}/`;
  const url = new URL(path, base);
  url.search = search;
  return url;
}

/** An error reply in the same shape as the real API: { error: { code, message } }. */
export function errorResponse(status: number, code: string, message: string) {
  return Response.json({ error: { code, message } }, { status });
}
