"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { readSessionName, saveSessionName } from "@/lib/session";
import { TAKEN_USERNAMES } from "@/lib/sample-data";
import { Button } from "./Button";
import { Input } from "./Input";

// Same rule the real API uses for usernames.
const USERNAME_RULE = /^[A-Za-z0-9_]{3,32}$/;

export function StartForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Already logged in (e.g. came back here with the browser's Back button)? Skip this page.
  // (Normal visits never get here: src/proxy.ts redirects them first.)
  useEffect(() => {
    if (readSessionName()) router.replace("/chat/rooms");
  }, [router]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // stop the browser from reloading the page
    const name = username.trim();
    if (!USERNAME_RULE.test(name)) {
      setError("Use 3–32 letters, numbers or underscores.");
      return;
    }
    if (TAKEN_USERNAMES.includes(name)) {
      setError(`"${name}" is already taken. Try another one.`);
      return;
    }
    saveSessionName(name); // remember the login on this browser
    router.replace("/chat/rooms"); // replace: Back won't return to the start page
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
      <Button type="submit">Start chatting</Button>
    </form>
  );
}
