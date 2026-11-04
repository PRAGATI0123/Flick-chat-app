import Link from "next/link";
import { Logo } from "./Logo";
import { Nav } from "./NavItem";

// For now "Log out" just goes back to the start page; real logout comes with the API.
function LogoutLink({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-surface-muted hover:text-foreground ${className}`}
    >
      Log out
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside className="flex flex-col gap-4 border-b border-border bg-surface p-4 md:w-60 md:border-r md:border-b-0">
      <div className="flex items-center justify-between">
        <Logo />
        {/* Mobile: next to the logo */}
        <LogoutLink className="md:hidden" />
      </div>
      <Nav />
      {/* Desktop: at the bottom of the sidebar */}
      <LogoutLink className="hidden md:mt-auto md:block" />
    </aside>
  );
}
