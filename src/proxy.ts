import { NextResponse, type NextRequest } from "next/server";

// Same name as SESSION_COOKIE in src/lib/session.ts (proxy files shouldn't rely on shared modules).
const SESSION_COOKIE = "guest_name";

/**
 * Runs before a page is shown:
 * - logged in and opening the start page  → go straight to the rooms
 * - not logged in and opening a chat page → go to the start page
 */
export function proxy(request: NextRequest) {
  const loggedIn = request.cookies.has(SESSION_COOKIE);
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
