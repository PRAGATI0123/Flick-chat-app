"use client";

import { useState, type FormEvent } from "react";
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
 * or click it. The box stays open while you hover it or while you are typing in it.
 */
export function ActionPopover({ label, placeholder, prefix, submitLabel, onSubmit }: ActionPopoverProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

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
    setError(null);
    // Take focus out of the box so it closes once the mouse leaves.
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  }

  return (
    <div className="group relative">
      <Button>{label}</Button>
      {/* Hidden until hover (group-hover) or focus inside (group-focus-within). pt-2 keeps hover alive in the gap. */}
      <div className="absolute right-0 top-full z-20 hidden pt-2 group-focus-within:block group-hover:block">
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
    </div>
  );
}
