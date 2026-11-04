import { Logo } from "./Logo";
import { Nav, type NavLink } from "./NavItem";

const MAIN_LINKS: NavLink[] = [
  { href: "/chat/rooms", label: "Rooms" },
  { href: "/chat/directMsg", label: "Direct messages" },
];

// For now "Log out" just goes back to the start page; real logout comes with the API.
const ACCOUNT_LINKS: NavLink[] = [
  { href: "/chat/block", label: "Blocked users" },
  { href: "/", label: "Log out" },
];

/**
 * Left sidebar.
 * - On chat pages (`withAccountLinks`) it shows everything.
 * - On list pages, Blocked users and Log out live in the right sidebar on
 *   wide screens (lg), so here they are only shown on smaller screens.
 */
export function Sidebar({ withAccountLinks = false }: { withAccountLinks?: boolean }) {
  const accountLinks = withAccountLinks
    ? ACCOUNT_LINKS
    : ACCOUNT_LINKS.map((link) => ({ ...link, className: "lg:hidden" }));

  return (
    <aside className="flex flex-col gap-4 border-b border-border bg-surface p-4 md:w-60 md:border-r md:border-b-0">
      <Logo />
      <Nav links={[...MAIN_LINKS, ...accountLinks]} />
    </aside>
  );
}

/** Right sidebar, only on list pages and only on wide screens. */
export function RightSidebar() {
  return (
    <aside className="hidden w-60 flex-col gap-2 border-l border-border bg-surface p-4 lg:flex">
      <p className="px-3 pt-2 text-xs font-medium tracking-wide text-muted uppercase">Account</p>
      <Nav links={ACCOUNT_LINKS} />
    </aside>
  );
}
