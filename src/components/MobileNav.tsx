"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { AccountActions } from "./AccountActions";
import { Avatar } from "./Avatar";
import { useChatStore } from "./ChatStore";
import { NAV_ICONS, type NavIconName } from "./icons";

/* Phone-only parts of the list pages (hidden from md = 768px wide and up). */

/** Top bar on phones: your name on the left, theme + Log out on the right. */
export function MobileTopBar() {
  const { myName } = useChatStore();
  return (
    <header className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2 md:hidden">
      <Avatar name={myName ?? "?"} size="sm" />
      <span className="min-w-0 flex-1 truncate text-sm font-medium">{myName && `@${myName}`}</span>
      <AccountActions compact />
    </header>
  );
}

const TABS: { href: string; label: string; icon: NavIconName }[] = [
  { href: "/chat/rooms", label: "Rooms", icon: "rooms" },
  { href: "/chat/directMsg", label: "Messages", icon: "messages" },
  { href: "/chat/block", label: "Blocked", icon: "blocked" },
];

function Tabs({ pathname }: { pathname?: string }) {
  const { unreadTotal } = useChatStore();
  return (
    // pb-[…safe-area…]: stay above the iPhone home bar
    <nav className="grid grid-cols-3 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] md:hidden">
      {TABS.map((tab) => {
        const Icon = NAV_ICONS[tab.icon];
        const active = !!pathname?.startsWith(tab.href);
        const badge = tab.href === "/chat/directMsg" ? unreadTotal : 0;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`relative flex flex-col items-center gap-0.5 py-2 text-xs font-medium ${
              active ? "text-accent" : "text-muted"
            }`}
          >
            <Icon className="size-5" />
            {tab.label}
            {!!badge && (
              <span className="absolute top-1 left-1/2 ml-2 rounded-full bg-accent px-1.5 text-[10px] leading-4 text-white">
                {badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function CurrentTabs() {
  return <Tabs pathname={usePathname()} />;
}

/** Bottom tab bar on phones. Like the sidebar, the highlight needs the URL, so it's inside Suspense. */
export function MobileTabBar() {
  return (
    <Suspense fallback={<Tabs />}>
      <CurrentTabs />
    </Suspense>
  );
}
