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
  /** Runs with the typed text. Return an error message to show it, or nothing if it worked. */
  onSubmit: (value: string) => string | void;
};

/**
 * A button that opens a small box with one text field when you hover over it
 * or click it. The box stays open while you type in it, and closes after it worked,
 * when the mouse leaves, when you click somewhere else, or on Escape.
 */
export function ActionPopover({ label, placeholder, prefix, submitLabel, onSubmit }: ActionPopoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function close() {
    setOpen(false);
    setError(null);
  }

  /** Is the cursor (keyboard focus) inside this box? Then don't close on mouse leave. */
  function focusIsInside() {
    return !!containerRef.current?.contains(document.activeElement);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // stop the browser from reloading the page
    const text = value.trim();
    if (!text) {
      setError("Please type something first.");
      return;
    }
    const problem = onSubmit(text);
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
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => !focusIsInside() && close()}
      // Focus moved somewhere outside the box (e.g. you clicked elsewhere): close it.
      onBlur={(event) => !containerRef.current?.contains(event.relatedTarget) && close()}
      onKeyDown={(event) => event.key === "Escape" && close()}
    >
      <Button onClick={() => setOpen((isOpen) => !isOpen)} aria-expanded={open}>
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
            <Button type="submit">{submitLabel}</Button>
          </form>
        </div>
      )}
    </div>
  );
}
