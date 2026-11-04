"use client";

import { createContext, use, useCallback, useRef, useState, type ReactNode } from "react";

type ToastInput = {
  message: string;
  /** Optional button on the toast, e.g. "Undo". */
  actionLabel?: string;
  onAction?: () => void;
};

type ToastItem = ToastInput & { id: number };

const ToastContext = createContext<(toast: ToastInput) => void>(() => {});

/** How long a toast stays on screen. */
const TOAST_MS = 5000;

/**
 * Small messages at the top of the screen ("Room created", "@user_2 blocked · Undo").
 * They disappear by themselves after a few seconds.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: ToastInput) => {
      const id = nextId.current++;
      // Keep at most 3 on screen.
      setToasts((current) => [...current.slice(-2), { ...toast, id }]);
      setTimeout(() => dismiss(id), TOAST_MS);
    },
    [dismiss],
  );

  return (
    <ToastContext value={showToast}>
      {children}
      {/* aria-live: screen readers read new toasts out loud */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-3 z-[60] flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl bg-foreground px-4 py-3 text-sm text-background shadow-lg"
          >
            <span className="min-w-0 flex-1">{toast.message}</span>
            {toast.onAction && (
              <button
                type="button"
                onClick={() => {
                  toast.onAction?.();
                  dismiss(toast.id);
                }}
                className="shrink-0 font-semibold underline underline-offset-2 hover:opacity-80"
              >
                {toast.actionLabel ?? "Undo"}
              </button>
            )}
          </div>
        ))}
      </div>
    </ToastContext>
  );
}

/** Returns showToast({ message, actionLabel?, onAction? }). */
export function useToast() {
  return use(ToastContext);
}
