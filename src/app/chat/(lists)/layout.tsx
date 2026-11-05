import type { ReactNode } from "react";
import { AppFrame } from "@/components/AppFrame";

// Frame for the list pages (Rooms, Direct messages, Blocked users).
// Desktop: both sidebars. Phone: top bar + bottom tabs.
export default function ListsLayout({ children }: { children: ReactNode }) {
  return <AppFrame>{children}</AppFrame>;
}
