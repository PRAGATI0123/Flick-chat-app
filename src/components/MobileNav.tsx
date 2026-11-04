"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import { AccountActions } from "./AccountActions";
import { Avatar } from "./Avatar";
import { useChatStore } from "./ChatStore";

/* Phone-only parts of the list pages (hidden from md = 768px wide and up). */

/** Top bar on phones: your name on the left, theme + Log out on the right. */
export function MobileTopBar() {
  const { me } = useChatStore();
  return (
    <header className="flex items-center gap-2 border-b border-border bg-surface px-4 py-2 md:hidden">
      <Avatar name={me} size="sm" />
      <span className="min-w-0 flex-1 truncate text-sm font-medium">@{me}</span>
      <AccountActions compact />
    </header>
  );
}

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: "size-5",
  "aria-hidden": true,
} as const;

const TABS: { href: string; label: string; icon: ReactNode }[] = [
  {
    href: "/chat/rooms",
    label: "Rooms",
    icon: (
      <svg {...iconProps}>
        <path d="M5 9h14M5 15h14M10 4 8 20M16 4l-2 16" />
      </svg>
    ),
  },
  {
    href: "/chat/directMsg",
    label: "Messages",
    icon: (
      <svg {...iconProps}>
        <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />
      </svg>
    ),
  },
  {
    href: "/chat/block",
    label: "Blocked",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="9" />
        <path d="m5.6 5.6 12.8 12.8" />
      </svg>
    ),
  },
];

function Tabs({ pathname }: { pathname?: string }) {
  const { unreadTotal } = useChatStore();
  return (
    // pb-[…safe-area…]: stay above the iPhone home bar
    <nav className="grid grid-cols-3 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] md:hidden">
      {TABS.map((tab) => {
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
            {tab.icon}
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
