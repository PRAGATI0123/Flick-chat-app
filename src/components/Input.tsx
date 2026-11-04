import type { ComponentProps } from "react";

type InputProps = Omit<ComponentProps<"input">, "prefix"> & {
  prefix?: string;
};

export function Input({ prefix, className = "", ...props }: InputProps) {
  return (
    <div className={`flex h-10 items-center rounded-lg border border-border bg-surface px-3 ${className}`}>
      {prefix && <span className="mr-1.5 text-muted">{prefix}</span>}
      <input className="w-full bg-transparent text-sm outline-none placeholder:text-muted" {...props} />
    </div>
  );
}
