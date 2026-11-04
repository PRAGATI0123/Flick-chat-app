"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

export type NavLink = { href: string; label: string; className?: string };

type NavItemProps = NavLink & { active?: boolean };

export function NavItem({ href, label, active = false, className = "" }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`rounded-lg px-3 py-2 text-sm font-medium ${
        active ? "bg-surface-muted text-foreground" : "text-muted hover:text-foreground"
      } ${className}`}
    >
      {label}
    </Link>
  );
}

function NavLinks({ links, pathname }: { links: NavLink[]; pathname?: string }) {
  return (
    <nav className="flex flex-wrap gap-1 md:flex-col">
      {links.map((link) => (
        // "/" is Log out, which is never the current page.
        <NavItem key={link.href} {...link} active={link.href !== "/" && !!pathname?.startsWith(link.href)} />
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
