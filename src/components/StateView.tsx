import type { ReactNode } from "react";

type StateViewProps = {
  title: string;
  description?: string;
  /** Optional link or button under the text. */
  action?: ReactNode;
};

export function StateView({ title, description, action }: StateViewProps) {
  return (
    <div className="flex flex-col items-center gap-1 px-6 py-16 text-center">
      <h2 className="font-semibold">{title}</h2>
      {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
