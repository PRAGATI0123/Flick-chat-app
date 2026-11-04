"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "./Button";
import { Input } from "./Input";

// Same rule the real API uses for usernames.
const USERNAME_RULE = /^[A-Za-z0-9_]{3,32}$/;

export function StartForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // stop the browser from reloading the page
    if (!USERNAME_RULE.test(username.trim())) {
      setError("Use 3–32 letters, numbers or underscores.");
      return;
    }
    // The name isn't saved anywhere yet; that comes with the API.
    router.push("/chat/rooms");
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
