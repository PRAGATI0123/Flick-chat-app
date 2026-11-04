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
    <form onSubmit={handleSubmit} className="flex gap-2 border-t border-border bg-surface p-4">
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
