import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  /** Optional button(s) shown on the right. */
  action?: ReactNode;
};

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-border px-6 py-5">
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {action}
    </header>
  );
}
