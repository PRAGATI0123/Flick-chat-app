"use client";

import type { Message } from "@/lib/sample-data";
import { Composer } from "./Composer";
import { MessageList } from "./MessageList";
import { StateView } from "./StateView";

type ChatViewProps = {
  messages: Message[];
  me: string;
  onSend: (body: string) => void;
  placeholder?: string;
  /** In a DM, the other person's username (see MessageList). */
  dmWith?: string;
  /** Clicking names/avatars opens the user card (see MessageList). */
  userMenu?: boolean;
  /** Put the cursor in the message box straight away. */
  autoFocus?: boolean;
};

/** Messages + the box to write a new one. */
export function ChatView({ messages, me, onSend, placeholder, dmWith, userMenu, autoFocus }: ChatViewProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {messages.length === 0 ? (
        <div className="flex-1">
          <StateView title="No messages yet" description="Say hi 👋" />
        </div>
      ) : (
        <MessageList messages={messages} me={me} dmWith={dmWith} userMenu={userMenu} />
      )}
      <Composer placeholder={placeholder} onSend={onSend} autoFocus={autoFocus} />
    </div>
  );
}
