import type { ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";

// Frame for an open chat: only the left sidebar, with every link in it.
export default function ChatsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh flex-col md:flex-row">
      <Sidebar withAccountLinks />
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</main>
    </div>
  );
}
