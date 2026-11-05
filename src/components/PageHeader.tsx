import Link from "next/link";
import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  /** Optional icon shown before the title (e.g. the Rooms icon). */
  icon?: ReactNode;
  description?: string;
  /** Optional button(s) shown on the right. */
  action?: ReactNode;
  /** Shows a "←" back link on phones (desktop has the sidebar instead). */
  backHref?: string;
};

export function PageHeader({ title, icon, description, action, backHref }: PageHeaderProps) {
  return (
    <header className="flex items-center gap-3 border-b border-border px-4 py-3 md:px-6 md:py-5">
      {backHref && (
        <Link
          href={backHref}
          aria-label="Back"
          className="-ml-2 grid size-9 shrink-0 place-items-center rounded-lg text-lg text-muted hover:bg-surface-muted hover:text-foreground md:hidden"
        >
          ←
        </Link>
      )}
      {/* min-w-0 + truncate: long names get "…" instead of pushing things off screen */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {icon && <span className="shrink-0 text-accent">{icon}</span>}
          <h1 className="truncate text-lg font-semibold md:text-xl">{title}</h1>
        </div>
        {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
