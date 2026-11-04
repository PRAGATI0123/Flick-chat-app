import { Logo } from "./Logo";
import { Nav } from "./NavItem";

export function Sidebar() {
  return (
    <aside className="flex flex-col gap-4 border-b border-border bg-surface p-4 md:w-60 md:border-r md:border-b-0">
      <Logo />
      <Nav />
    </aside>
  );
}
