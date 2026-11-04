import type { ReactNode } from "react";
import { ChatStoreProvider } from "@/components/ChatStore";

// Wraps every /chat page (both the list and the chat layouts) with the shared
// chat data, so it is kept while you move between pages.
export default function ChatLayout({ children }: { children: ReactNode }) {
  return <ChatStoreProvider>{children}</ChatStoreProvider>;
}
