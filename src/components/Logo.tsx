import { MessagesSquare } from "lucide-react";

export function Logo() {
  return (
    <span className="flex items-center gap-2 font-semibold">
    
      <span className="grid size-9 place-items-center rounded-lg bg-accent text-white">
          <MessagesSquare className="size-6" />
      </span>
      <span className="text-xl tracking-tight">Flick</span>
    </span>
  );
}
