import type { ReactNode } from "react";
import { ChatStoreProvider } from "@/components/ChatStore";
import { QuickDmPanel } from "@/components/QuickDmPanel";
import { ToastProvider } from "@/components/Toast";

// Wraps every /chat page (both the list and the chat layouts) with the shared
// chat data and the toast messages, so they are kept while you move between pages.
// The DM panel lives here too, so it can open on top of any chat page.
export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <ChatStoreProvider>
        {children}
        <QuickDmPanel />
      </ChatStoreProvider>
    </ToastProvider>
  );
}
