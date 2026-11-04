"use client";

import { useState } from "react";
import type { Message } from "@/lib/sample-data";
import { Composer } from "./Composer";
import { MessageList } from "./MessageList";
import { StateView } from "./StateView";

type ChatViewProps = {
  initialMessages: Message[];
  me: string;
  placeholder?: string;
};

/** Messages + the box to write a new one. Sent messages are kept only in memory for now. */
export function ChatView({ initialMessages, me, placeholder }: ChatViewProps) {
  const [messages, setMessages] = useState(initialMessages);

  function send(body: string) {
    const time = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    setMessages((current) => [
      ...current,
      { id: (current.at(-1)?.id ?? 0) + 1, sender: me, body, time },
    ]);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {messages.length === 0 ? (
        <div className="flex-1">
          <StateView title="No messages yet" description="Say hi 👋" />
        </div>
      ) : (
        <MessageList messages={messages} me={me} />
      )}
      <Composer placeholder={placeholder} onSend={send} />
    </div>
  );
}
