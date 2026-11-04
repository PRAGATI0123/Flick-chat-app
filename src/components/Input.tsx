import type { ComponentProps } from "react";

type InputProps = Omit<ComponentProps<"input">, "prefix"> & {
  prefix?: string;
};

export function Input({ prefix, className = "", ...props }: InputProps) {
  return (
    <div className={`flex h-10 items-center rounded-lg border border-border bg-surface px-3 ${className}`}>
      {prefix && <span className="mr-1.5 text-muted">{prefix}</span>}
      {/* text-base (16px) on phones: smaller text makes iPhones zoom in when you tap the box */}
      <input className="w-full min-w-0 bg-transparent text-base outline-none placeholder:text-muted sm:text-sm" {...props} />
    </div>
  );
}
