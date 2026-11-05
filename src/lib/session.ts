// Your username on this browser, stored in a normal cookie so the app can show it.
// It's set by our server route /api/register (together with the hidden login token).
// readSessionName / clearSession use `document`, so call them in the browser only.

/** Cookie name. src/proxy.ts uses the same name (keep them in sync). */
export const SESSION_COOKIE = "guest_name";

/** The logged-in username, or null if nobody is logged in. */
export function readSessionName(): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${SESSION_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function clearSession() {
  // max-age=0 tells the browser to delete the cookie right away.
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; samesite=lax`;
}
