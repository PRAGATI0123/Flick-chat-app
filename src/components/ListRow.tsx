import Link from "next/link";
import { Avatar } from "./Avatar";

type ListRowProps = {
  href: string;
  title: string;
  subtitle?: string;
  /** Text in the square on the left, e.g. "#". Defaults to the first letter of the title. */
  icon?: string;
};

export function ListRow({ href, title, subtitle, icon }: ListRowProps) {
  return (
    <li>
      <Link href={href} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-muted">
        <Avatar name={title} label={icon} />
        <span className="flex min-w-0 flex-col">
          <span className="truncate font-medium">{title}</span>
          {subtitle && <span className="truncate text-sm text-muted">{subtitle}</span>}
        </span>
      </Link>
    </li>
  );
}
