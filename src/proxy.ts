import { NextResponse, type NextRequest } from "next/server";

// Same name as TOKEN_COOKIE in src/lib/server/helpers.ts (proxy files shouldn't rely on shared modules).
// It's the hidden cookie with the real login token, set by /api/register.
const TOKEN_COOKIE = "chat_token";

/**
 * Runs before a page is shown:
 * - logged in and opening the start page  → go straight to the rooms
 * - not logged in and opening a chat page → go to the start page
 * "Logged in" = the token cookie is there. (If the real API later says the token is no
 * longer valid, our middleman deletes the cookie, and this sends you to the start page.)
 */
export function proxy(request: NextRequest) {
  const loggedIn = request.cookies.has(TOKEN_COOKIE);
  const { pathname } = request.nextUrl;

  if (pathname === "/" && loggedIn) {
    return NextResponse.redirect(new URL("/chat/rooms", request.url));
  }
  if (pathname.startsWith("/chat") && !loggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

// Only run for the start page and the chat pages (not for images, CSS, etc.).
export const config = {
  matcher: ["/", "/chat/:path*"],
};
