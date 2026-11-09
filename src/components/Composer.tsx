"use client";

import { useState, type FormEvent } from "react";
import { Button } from "./Button";
import { Input } from "./Input";

type ComposerProps = {
  placeholder?: string;
  /** Sends the message. Return (or resolve to) false if it didn't go: the text comes back. */
  onSend: (body: string) => boolean | void | Promise<boolean | void>;
  /** Put the cursor in the box straight away (used by the mini chat). */
  autoFocus?: boolean;
};

export function Composer({ placeholder = "Write a message…", onSend, autoFocus }: ComposerProps) {
  const [text, setText] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // stop the browser from reloading the page
    const body = text.trim();
    if (!body) return;
    setText(""); // empty the box straight away, so it feels instant
    const sent = await onSend(body);
    // Didn't go (e.g. no internet): put the text back so it isn't lost,
    // unless you've already started typing something new.
    if (sent === false) setText((current) => current || body);
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
        autoFocus={autoFocus}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button type="submit" disabled={!text.trim()}>
        Send
      </Button>
    </form>
  );
}
