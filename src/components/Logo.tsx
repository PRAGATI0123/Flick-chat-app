import { MessagesSquare } from "lucide-react";

export function Logo() {
  return (
    <span className="flex items-center gap-2 font-semibold">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-white">
        <MessagesSquare className="size-6" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-xl tracking-tight">Flick</span>
        <span className="text-xs font-normal text-muted">Here for a moment</span>
      </span>
    </span>
  );
}
