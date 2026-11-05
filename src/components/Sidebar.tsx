import { AccountActions } from "./AccountActions";
import { Logo } from "./Logo";
import { Nav, type NavLink } from "./NavItem";

const MAIN_LINKS: NavLink[] = [
  { href: "/chat/rooms", label: "Rooms", icon: "rooms" },
  { href: "/chat/directMsg", label: "Direct messages", icon: "messages" },
];

const BLOCKED_LINK: NavLink = { href: "/chat/block", label: "Blocked users", icon: "blocked" };

/**
 * Left sidebar, from tablet size (md, 768px) up. Phones use MobileTopBar/MobileTabBar instead.
 * On wide screens (lg, 1024px) Blocked users / theme / Log out move to the right sidebar,
 * so here they are only shown on tablets.
 */
export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col gap-1 border-r border-border bg-surface p-4 md:flex">
      <div className="mb-3">
        <Logo />
      </div>
      <Nav links={[...MAIN_LINKS, { ...BLOCKED_LINK, className: "lg:hidden" }]} />
      <AccountActions className="lg:hidden" />
    </aside>
  );
}

/** Right sidebar, only on wide screens. */
export function RightSidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col gap-1 border-l border-border bg-surface p-4 lg:flex">
      <p className="px-3 pt-2 pb-1 text-xs font-medium tracking-wide text-muted uppercase">Account</p>
      <Nav links={[BLOCKED_LINK]} />
      <AccountActions />
    </aside>
  );
}
