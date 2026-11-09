"use client";

import { useRef, useState, type FormEvent } from "react";
import { Button } from "./Button";
import { Input } from "./Input";

type ActionPopoverProps = {
  /** Text on the button, e.g. "Create room". */
  label: string;
  placeholder: string;
  prefix?: string;
  /** Text on the button inside the box, e.g. "Create". */
  submitLabel: string;
  /** Text on the box's button while waiting for the server, e.g. "Creating…". */
  busyLabel?: string;
  /**
   * Runs with the typed text. Return (or resolve to) an error message to show it,
   * or nothing if it worked. Can be async: the box waits for the server's answer.
   */
  onSubmit: (value: string) => string | void | Promise<string | void>;
};


export function ActionPopover({
  label,
  placeholder,
  prefix,
  submitLabel,
  busyLabel = "Please wait…",
  onSubmit,
}: ActionPopoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false); // waiting for the server?

  function close() {
    setOpen(false);
    setError(null);
  }

  /** Is the cursor (keyboard focus) inside this box? Then don't close on mouse leave. */
  function focusIsInside() {
    return !!containerRef.current?.contains(document.activeElement);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // stop the browser from reloading the page
    const text = value.trim();
    if (!text) {
      setError("Please type something first.");
      return;
    }
    setBusy(true);
    const problem = await onSubmit(text); // e.g. creates the room on the server
    setBusy(false);
    if (problem) {
      setError(problem);
      return;
    }
    setValue("");
    close();
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      // Hover only for a real mouse: on phones a tap would "hover" and then "click" (= open + close).
      onPointerEnter={(event) => event.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(event) => event.pointerType === "mouse" && !focusIsInside() && close()}
      // Focus moved somewhere outside the box (e.g. you clicked elsewhere): close it.
      onBlur={(event) => !containerRef.current?.contains(event.relatedTarget) && close()}
      onKeyDown={(event) => event.key === "Escape" && close()}
    >
      {/* Click always opens (hover may have opened it already, so a toggle would close it again)
          and puts the cursor in the box, ready to type. (Hover doesn't: then moving the mouse
          away couldn't close it.) setTimeout: wait until the box is on screen. */}
      <Button
        onClick={() => {
          setOpen(true);
          setTimeout(() => inputRef.current?.focus());
        }}
        aria-expanded={open}
      >
        {label}
      </Button>

      {open && (
        // pt-2 is an invisible gap, so the mouse can move from the button to the box without closing it
        <div className="absolute right-0 top-full z-20 pt-2">
          <form
            onSubmit={handleSubmit}
            className="flex w-72 flex-col gap-2 rounded-xl border border-border bg-surface p-3 shadow-lg"
          >
            <Input
              ref={inputRef}
              prefix={prefix}
              placeholder={placeholder}
              autoComplete="off"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError(null);
              }}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <Button type="submit" disabled={busy}>
              {busy ? busyLabel : submitLabel}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
