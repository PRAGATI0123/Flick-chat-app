"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { useChatStore } from "./ChatStore";

export type NavLink = { href: string; label: string; className?: string };

// Same look for menu links and menu buttons (Log out, theme switch).
export const NAV_ITEM_CLASS = "flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium";

type NavItemProps = NavLink & { active?: boolean; badge?: number };

export function NavItem({ href, label, active = false, badge, className = "" }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`${NAV_ITEM_CLASS} ${
        active ? "bg-surface-muted text-foreground" : "text-muted hover:text-foreground"
      } ${className}`}
    >
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
    <nav className="flex flex-wrap gap-1 md:flex-col">
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
