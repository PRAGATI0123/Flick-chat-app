"use client";

import { useEffect, useRef } from "react";
import type { Message } from "@/lib/sample-data";
import { MessageBox } from "./MessageBox";

export function MessageList({ messages, me }: { messages: Message[]; me: string }) {
  const endRef = useRef<HTMLDivElement>(null);

  // Whenever a message is added, scroll down so the newest one is visible.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
      {messages.map((m) => (
        <MessageBox key={m.id} sender={m.sender} body={m.body} time={m.time} mine={m.sender === me} />
      ))}
      <div ref={endRef} />
    </div>
  );
}
