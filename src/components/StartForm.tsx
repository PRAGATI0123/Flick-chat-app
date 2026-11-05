"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { readSessionName } from "@/lib/session";
import { Button } from "./Button";
import { Input } from "./Input";

// Same rule the real API uses for usernames (checked here first, so obvious mistakes
// show instantly without asking the server).
const USERNAME_RULE = /^[A-Za-z0-9_]{3,32}$/;

export function StartForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false); // waiting for the server?

  // Already logged in (e.g. came back here with the browser's Back button)? Skip this page.
  // (Normal visits never get here: src/proxy.ts redirects them first.)
  useEffect(() => {
    if (readSessionName()) router.replace("/chat/rooms");
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // stop the browser from reloading the page
    const name = username.trim();
    if (!USERNAME_RULE.test(name)) {
      setError("Use 3–32 letters, numbers or underscores.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      // Our server route registers the name on the real API and keeps the token in a hidden cookie.
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name }),
      });
      if (response.ok) {
        router.replace("/chat/rooms"); // replace: Back won't return to the start page
        return; // keep the button in "Starting…" while the next page opens
      }
      const json = await response.json().catch(() => null);
      setError(
        response.status === 409
          ? `"${name}" is already taken. Try another one.`
          : (json?.error?.message ?? "Couldn't create your username. Try again."),
      );
    } catch {
      setError("Can't reach the server. Check your internet connection.");
    }
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
      <Input
        prefix="@"
        name="username"
        placeholder="cool_panda_42"
        autoComplete="off"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          setError(null);
        }}
      />
      <p className={`text-xs ${error ? "text-red-500" : "text-muted"}`}>
        {error ?? "3–32 characters: letters, numbers and underscores."}
      </p>
      <Button type="submit" disabled={submitting}>
        {submitting ? "Starting…" : "Start chatting"}
      </Button>
    </form>
  );
}
