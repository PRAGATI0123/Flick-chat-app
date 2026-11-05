"use client";

import type { ReactNode } from "react";
import { Avatar } from "./Avatar";
import { useChatStore } from "./ChatStore";
import { MobileTabBar, MobileTopBar } from "./MobileNav";
import { RightSidebar, Sidebar } from "./Sidebar";

/** Your name between the two sidebars (tablet and up; phones show it in the top bar). */
function UserBar() {
  const { myName } = useChatStore();
  return (
    <div className="hidden items-center gap-3 border-b border-border px-6 py-3 md:flex">
      <Avatar name={myName ?? "?"} size="sm" />
      <p className="text-sm font-medium">{myName ? `@${myName}` : " "}</p>
    </div>
  );
}

type AppFrameProps = {
  children: ReactNode;
  /** Phone top bar + bottom tabs. Off for open chats, which use the whole phone screen. */
  mobileBars?: boolean;
};

/**
 * The same frame for every chat page:
 * Desktop:  left sidebar | your name + page | right sidebar
 * Phone:    top bar / page / bottom tabs   (or the whole screen for an open chat)
 */
export function AppFrame({ children, mobileBars = true }: AppFrameProps) {
  return (
    <div className="flex h-dvh flex-col md:flex-row">
      {mobileBars && <MobileTopBar />}
      <Sidebar />
      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <UserBar />
        {children}
      </main>
      <RightSidebar />
      {mobileBars && <MobileTabBar />}
    </div>
  );
}
