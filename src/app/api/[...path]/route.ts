import { NextResponse, type NextRequest } from "next/server";
import { TOKEN_COOKIE, apiUrl, errorResponse } from "@/lib/server/helpers";
import { SESSION_COOKIE } from "@/lib/session";

/**
 * The "middleman" for every API call from the browser.
 *
 *   browser asks:  /api/rooms/12/messages?after=…
 *   we ask:        <CHAT_API_BASE_URL>/rooms/12/messages?after=…
 *                  with "Authorization: Bearer <token>" taken from the hidden cookie
 *   and send the real API's answer back unchanged.
 *
 * ([...path] in the folder name means: any path after /api/ lands here, as a list of parts.)
 */
async function forward(request: NextRequest, ctx: RouteContext<"/api/[...path]">) {
  const { path } = await ctx.params; // e.g. ["rooms", "12", "messages"]

  // Safety: don't let a path like /api/../something escape the API's address.
  if (path.some((part) => part === "." || part === "..")) {
    return errorResponse(400, "BAD_REQUEST", "Invalid path.");
  }

  // No token cookie = not logged in. Don't even bother the real API.
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  if (!token) {
    return errorResponse(401, "UNAUTHENTICATED", "You're not logged in.");
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`, // the spec: every request needs the token like this
  };

  // POST requests carry a body (e.g. { "body": "hello" }); pass it on as it is.
  let body: string | undefined;
  if (request.method === "POST") {
    body = await request.text();
    if (body) headers["Content-Type"] = "application/json";
  }

  let answer: Response;
  try {
    answer = await fetch(apiUrl(path.map(encodeURIComponent).join("/"), request.nextUrl.search), {
      method: request.method,
      headers,
      body: body || undefined,
      cache: "no-store", // always fresh: chats change all the time
    });
  } catch (error) {
    // The real API is down, the internet is off, or CHAT_API_BASE_URL is missing.
    console.error(error);
    return errorResponse(502, "API_UNREACHABLE", "Can't reach the chat server. Try again in a moment.");
  }

  // Send the real API's answer back to the browser, unchanged.
  const text = await answer.text();
  const response = new NextResponse(text || null, {
    status: answer.status,
    headers: { "Content-Type": answer.headers.get("Content-Type") ?? "application/json" },
  });

  // 401 from the real API = this token no longer works (e.g. the guest was deleted after
  // 24h without activity). Forget it and the name, so the app goes back to the start page.
  if (answer.status === 401) {
    response.cookies.delete(TOKEN_COOKIE);
    response.cookies.delete(SESSION_COOKIE);
  }

  return response;
}

// The same middleman handles reading (GET), sending (POST) and deleting (DELETE).
export { forward as GET, forward as POST, forward as DELETE };
