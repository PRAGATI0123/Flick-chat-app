import Link from "next/link";
import type { ReactNode } from "react";
import { Avatar } from "./Avatar";

type ListRowProps = {
  href: string;
  title: string;
  subtitle?: string;
  /** Text in the square on the left, e.g. "#". Defaults to the first letter of the title. */
  icon?: string;
  /** Unread count shown as a small bubble. */
  badge?: number;
  /** Button(s) at the end of the row, outside the link (e.g. Delete). */
  action?: ReactNode;
};

export function ListRow({ href, title, subtitle, icon, badge, action }: ListRowProps) {
  return (
    <li className="flex items-center hover:bg-surface-muted">
      <Link href={href} className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3">
        <Avatar name={title} label={icon} />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate font-medium">{title}</span>
          {subtitle && <span className="truncate text-sm text-muted">{subtitle}</span>}
        </span>
        {!!badge && (
          <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-white">{badge}</span>
        )}
      </Link>
      {action && <div className="pr-3">{action}</div>}
    </li>
  );
}
