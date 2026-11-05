// Remembers who is logged in on this browser, in a small cookie, so the start
// page is skipped next time. UI only for now: the real login token from the API
// comes in Part B. These functions use `document`, so call them in the browser only.

/** Cookie name. src/proxy.ts uses the same name (keep them in sync). */
export const SESSION_COOKIE = "guest_name";

/** 30 days, in seconds. */
const MAX_AGE = 60 * 60 * 24 * 30;

/** The logged-in username, or null if nobody is logged in. */
export function readSessionName(): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${SESSION_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function saveSessionName(name: string) {
  document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(name)}; path=/; max-age=${MAX_AGE}; samesite=lax`;
}

export function clearSession() {
  // max-age=0 tells the browser to delete the cookie right away.
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; samesite=lax`;
}
