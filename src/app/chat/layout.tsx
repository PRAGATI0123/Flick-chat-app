import type { ReactNode } from "react";
import { ChatStoreProvider } from "@/components/ChatStore";
import { ToastProvider } from "@/components/Toast";

// Wraps every /chat page (both the list and the chat layouts) with the shared
// chat data and the toast messages, so they are kept while you move between pages.
export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <ChatStoreProvider>{children}</ChatStoreProvider>
    </ToastProvider>
  );
}
