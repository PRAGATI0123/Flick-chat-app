"use client";

import { useState, type FormEvent } from "react";
import { Button } from "./Button";
import { Input } from "./Input";

type ComposerProps = {
  placeholder?: string;
  onSend: (body: string) => void;
};

export function Composer({ placeholder = "Write a message…", onSend }: ComposerProps) {
  const [text, setText] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // stop the browser from reloading the page
    const body = text.trim();
    if (!body) return;
    onSend(body);
    setText("");
  }

  return (
    // pb-[…safe-area…]: on iPhones, stay above the home bar at the bottom of the screen
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 border-t border-border bg-surface p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:p-4"
    >
      <Input
        name="body"
        placeholder={placeholder}
        autoComplete="off"
        className="flex-1"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button type="submit" disabled={!text.trim()}>
        Send
      </Button>
    </form>
  );
}
