import Link from "next/link";

type ListRowProps = {
  href: string;
  title: string;
  subtitle?: string;
  /** Text in the square on the left, e.g. "#" or a first letter. */
  icon?: string;
};

export function ListRow({ href, title, subtitle, icon = "#" }: ListRowProps) {
  return (
    <li>
      <Link href={href} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-muted">
        <span className="grid size-9 place-items-center rounded-lg bg-surface-muted font-medium uppercase text-muted">{icon}</span>
        <span className="flex flex-col">
          <span className="font-medium">{title}</span>
          {subtitle && <span className="text-sm text-muted">{subtitle}</span>}
        </span>
      </Link>
    </li>
  );
}
