"use client";

import { useEffect, useRef, useState } from "react";
import type { Message } from "@/lib/sample-data";
import { MessageBox } from "./MessageBox";
import { UserDialog } from "./UserDialog";

export function MessageList({ messages, me }: { messages: Message[]; me: string }) {
  const endRef = useRef<HTMLDivElement>(null);
  // Which username's popup is open (null = none).
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Whenever a message is added, scroll down so the newest one is visible.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
      {messages.map((m, i) => (
        <MessageBox
          key={m.id}
          sender={m.sender}
          body={m.body}
          time={m.time}
          mine={m.sender === me}
          // Same person as the message before? Then don't repeat the name/avatar.
          showHeader={i === 0 || messages[i - 1].sender !== m.sender}
          onUserClick={setSelectedUser}
        />
      ))}
      <div ref={endRef} />

      {selectedUser && <UserDialog username={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
  );
}
