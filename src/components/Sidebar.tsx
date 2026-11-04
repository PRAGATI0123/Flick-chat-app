import { AccountActions } from "./AccountActions";
import { Logo } from "./Logo";
import { Nav, type NavLink } from "./NavItem";

const MAIN_LINKS: NavLink[] = [
  { href: "/chat/rooms", label: "Rooms" },
  { href: "/chat/directMsg", label: "Direct messages" },
];

const BLOCKED_LINK: NavLink = { href: "/chat/block", label: "Blocked users" };

/**
 * Left sidebar.
 * - On chat pages (`withAccountLinks`) it shows everything.
 * - On list pages, Blocked users / theme / Log out live in the right sidebar on
 *   wide screens (lg), so here they are only shown on smaller screens.
 */
export function Sidebar({ withAccountLinks = false }: { withAccountLinks?: boolean }) {
  const onlyOnSmallScreens = withAccountLinks ? "" : "lg:hidden";

  return (
    <aside className="flex flex-col gap-1 border-b border-border bg-surface p-4 md:w-60 md:border-r md:border-b-0">
      <div className="mb-3">
        <Logo />
      </div>
      <Nav links={[...MAIN_LINKS, { ...BLOCKED_LINK, className: onlyOnSmallScreens }]} />
      <AccountActions className={onlyOnSmallScreens} />
    </aside>
  );
}

/** Right sidebar, only on list pages and only on wide screens. */
export function RightSidebar() {
  return (
    <aside className="hidden w-60 flex-col gap-1 border-l border-border bg-surface p-4 lg:flex">
      <p className="px-3 pt-2 pb-1 text-xs font-medium tracking-wide text-muted uppercase">Account</p>
      <Nav links={[BLOCKED_LINK]} />
      <AccountActions />
    </aside>
  );
}
