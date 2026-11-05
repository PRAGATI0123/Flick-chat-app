import Link from "next/link";
import type { ReactNode } from "react";
import { Avatar } from "./Avatar";

type ListRowProps = {
  href: string;
  title: string;
  subtitle?: string;
  /** What goes in the square on the left (text or an icon). Defaults to the first letter of the title. */
  icon?: ReactNode;
  /** Small text on the right, e.g. the time of the last message. */
  meta?: string;
  /** Unread count shown as a small bubble. */
  badge?: number;
  /** Button(s) at the end of the row, outside the link (e.g. Delete). */
  action?: ReactNode;
};

export function ListRow({ href, title, subtitle, icon, meta, badge, action }: ListRowProps) {
  return (
    <li className="flex items-center hover:bg-surface-muted">
      <Link href={href} className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3">
        <Avatar name={title} label={icon} />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate font-medium">{title}</span>
          {subtitle && <span className="truncate text-sm text-muted">{subtitle}</span>}
        </span>
        {(meta || !!badge) && (
          <span className="flex shrink-0 flex-col items-end gap-1">
            {meta && <span className="text-xs text-muted">{meta}</span>}
            {!!badge && (
              <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-white">{badge}</span>
            )}
          </span>
        )}
      </Link>
      {action && <div className="pr-2 md:pr-3">{action}</div>}
    </li>
  );
}
