import type { ReactNode } from "react";

// Same name always gives the same colour ("@" or "#" at the start is ignored).
function hueFor(name: string) {
  let hash = 0;
  for (const char of name.replace(/^[@#]/, "")) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return Math.abs(hash) % 360;
}

type AvatarProps = {
  /** Used to pick the colour. */
  name: string;
  /** What goes inside the square (text or an icon). Defaults to the first letter of the name. */
  label?: ReactNode;
  size?: "sm" | "md";
};

export function Avatar({ name, label, size = "md" }: AvatarProps) {
  const hue = hueFor(name);
  return (
    <span
      aria-hidden
      className={`grid shrink-0 place-items-center rounded-lg font-semibold uppercase ${
        size === "sm" ? "size-8 text-xs" : "size-9 text-sm"
      }`}
      style={{ backgroundColor: `hsl(${hue} 70% 50% / 0.15)`, color: `hsl(${hue} 65% 55%)` }}
    >
      {label ?? name.replace(/^[@#]/, "").charAt(0)}
    </span>
  );
}
