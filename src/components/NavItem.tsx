"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { useChatStore } from "./ChatStore";
import { NAV_ICONS, type NavIconName } from "./icons";

export type NavLink = { href: string; label: string; icon: NavIconName; className?: string };

// Same look for menu links and menu buttons (Log out, theme switch).
export const NAV_ITEM_CLASS = "flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium";

type NavItemProps = NavLink & { active?: boolean; badge?: number };

export function NavItem({ href, label, icon, active = false, badge, className = "" }: NavItemProps) {
  const Icon = NAV_ICONS[icon]; // e.g. "rooms" → RoomsIcon
  return (
    <Link
      href={href}
      className={`${NAV_ITEM_CLASS} ${
        active ? "bg-surface-muted text-foreground" : "text-muted hover:text-foreground"
      } ${className}`}
    >
      <Icon />
      {label}
      {!!badge && (
        <span className="ml-auto rounded-full bg-accent px-1.5 py-0.5 text-xs leading-none text-white">{badge}</span>
      )}
    </Link>
  );
}

function NavLinks({ links, pathname }: { links: NavLink[]; pathname?: string }) {
  const { unreadTotal } = useChatStore();

  return (
    <nav className="flex flex-col gap-1">
      {links.map((link) => (
        <NavItem
          key={link.href}
          {...link}
          active={!!pathname?.startsWith(link.href)}
          badge={link.href === "/chat/directMsg" ? unreadTotal : undefined}
        />
      ))}
    </nav>
  );
}

function CurrentNavLinks({ links }: { links: NavLink[] }) {
  return <NavLinks links={links} pathname={usePathname()} />;
}

/**
 * The current path is only known at request time, so the highlighted version
 * renders inside Suspense; the fallback is the same links without a highlight.
 */
export function Nav({ links }: { links: NavLink[] }) {
  return (
    <Suspense fallback={<NavLinks links={links} />}>
      <CurrentNavLinks links={links} />
    </Suspense>
  );
}
