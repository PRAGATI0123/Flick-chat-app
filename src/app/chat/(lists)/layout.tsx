import type { ReactNode } from "react";
import { Avatar } from "@/components/Avatar";
import { RightSidebar, Sidebar } from "@/components/Sidebar";
import { ME } from "@/lib/sample-data";

// Frame for the list pages (Rooms, Direct messages, Blocked users):
// left sidebar | your name + page | right sidebar
export default function ListsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh flex-col md:flex-row">
      <Sidebar />
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="flex items-center gap-3 border-b border-border px-6 py-3">
          <Avatar name={ME} size="sm" />
          <div className="leading-tight">
            <p className="text-sm font-medium">@{ME}</p>
            <p className="text-xs text-muted">Signed in as guest</p>
          </div>
        </div>
        {children}
      </main>
      <RightSidebar />
    </div>
  );
}
