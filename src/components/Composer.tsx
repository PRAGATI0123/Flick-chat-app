import { Button } from "./Button";
import { Input } from "./Input";

export function Composer({ placeholder = "Write a message…" }: { placeholder?: string }) {
  return (
    <form className="flex gap-2 border-t border-border bg-surface p-4">
      <Input name="body" placeholder={placeholder} autoComplete="off" className="flex-1" />
      <Button type="submit">Send</Button>
    </form>
  );
}
