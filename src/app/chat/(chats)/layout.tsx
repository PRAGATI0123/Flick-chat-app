import type { ReactNode } from "react";
import { AppFrame } from "@/components/AppFrame";

// Frame for an open chat. Desktop: the same two sidebars as the list pages.
// Phone: no top bar / tabs, so the chat gets the whole screen (the header has a "←" back button).
export default function ChatsLayout({ children }: { children: ReactNode }) {
  return <AppFrame mobileBars={false}>{children}</AppFrame>;
}
