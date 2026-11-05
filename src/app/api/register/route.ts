import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";
import { TOKEN_COOKIE, TOKEN_COOKIE_OPTIONS, apiUrl, errorResponse } from "@/lib/server/helpers";


type RegisterAnswer = { data: { username: string; token: string; created_at: string } };

export async function POST(request: NextRequest) {
  const input = await request.json().catch(() => null);
  const username = typeof input?.username === "string" ? input.username.trim() : "";

  let answer: Response;
  try {
    answer = await fetch(apiUrl("register"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ username }),
      cache: "no-store",
    });
  } catch {
    return errorResponse(502, "API_UNREACHABLE", "Can't reach the chat server. Try again in a moment.");
  }

  const json = await answer.json().catch(() => null);

  // Not OK (409 = name taken, 400 = invalid name, …): pass the real API's error on.
  if (!answer.ok) {
    return json?.error
      ? Response.json(json, { status: answer.status })
      : errorResponse(answer.status, "REGISTER_FAILED", "Couldn't create your username. Try again.");
  }

  // Take the token out; send the browser only { username, created_at }.
  const { token, ...user } = (json as RegisterAnswer).data;
  const response = NextResponse.json({ data: user }, { status: 201 });
  response.cookies.set(TOKEN_COOKIE, token, TOKEN_COOKIE_OPTIONS); // hidden: the login
  response.cookies.set(SESSION_COOKIE, user.username, { ...TOKEN_COOKIE_OPTIONS, httpOnly: false }); // visible: your name
  return response;
}
