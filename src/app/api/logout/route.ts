import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";
import { TOKEN_COOKIE } from "@/lib/server/helpers";

/**
 * POST /api/logout
 *
 * Forgets the login on this browser by deleting both cookies (the hidden token and
 * your username). The real API has no "log out" endpoint: a guest who isn't used
 * anymore is deleted by the server itself after 24 hours.
 */
export async function POST() {
  const response = NextResponse.json({ data: { logged_out: true } });
  response.cookies.delete(TOKEN_COOKIE);
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
