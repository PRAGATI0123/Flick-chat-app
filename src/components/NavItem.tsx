"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

const LINKS = [
  { href: "/chat/rooms", label: "Rooms" },
  { href: "/chat/directMsg", label: "Direct messages" },
  { href: "/chat/block", label: "Blocked users" },
];

export function NavItem({ href, label, active = false }: { href: string; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-lg px-3 py-2 text-sm font-medium ${
        active ? "bg-surface-muted text-foreground" : "text-muted hover:text-foreground"
      }`}
    >
      {label}
    </Link>
  );
}

function NavLinks({ pathname }: { pathname?: string }) {
  return (
    <nav className="flex gap-1 md:flex-col">
      {LINKS.map((link) => (
        <NavItem key={link.href} {...link} active={!!pathname?.startsWith(link.href)} />
      ))}
    </nav>
  );
}

function CurrentNavLinks() {
  return <NavLinks pathname={usePathname()} />;
}

/**
 * The current path is only known at request time, so the highlighted version
 * renders inside Suspense; the fallback is the same links without a highlight.
 */
export function Nav() {
  return (
    <Suspense fallback={<NavLinks />}>
      <CurrentNavLinks />
    </Suspense>
  );
}
