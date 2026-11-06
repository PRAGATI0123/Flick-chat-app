"use client";

import { useEffect, useRef } from "react";

/**
 * Polling: run `callback` again and again, every `intervalMs` milliseconds.
 * Our chat API can't tell us when something new happens, so the app keeps asking
 * ("anything new?") every few seconds. The spec suggests 3–5 seconds, never under 1.
 *
 * - It waits `intervalMs` before the first run (the page loads its data itself first).
 * - It never runs twice at the same time: the next wait starts after the previous run ends.
 * - It pauses while the browser tab is hidden (other tab, phone locked) to save data and
 *   battery, and checks once right away when you come back.
 * - `enabled = false` stops it (e.g. while the page is still loading, or the room is gone).
 */
export function usePolling(callback: () => unknown, intervalMs: number, enabled = true) {
  // Always call the newest version of the callback (it sees the latest messages),
  // without restarting the timer every time the page re-renders.
  const latestCallback = useRef(callback);
  useEffect(() => {
    latestCallback.current = callback;
  });

  useEffect(() => {
    if (!enabled) return;

    let stopped = false; // the page went away (or polling was turned off)
    let running = false; // a check is happening right now
    let timer: ReturnType<typeof setTimeout> | undefined;

    function scheduleNext() {
      clearTimeout(timer);
      if (!stopped && document.visibilityState === "visible") {
        timer = setTimeout(runOnce, intervalMs);
      }
    }

    async function runOnce() {
      if (stopped || running) return;
      running = true;
      try {
        await latestCallback.current();
      } catch {
        // The callback handles its own errors; a failed check just tries again next time.
      } finally {
        running = false;
      }
      scheduleNext();
    }

    function onVisibilityChange() {
      if (document.visibilityState === "visible") runOnce(); // back on the tab: check right away
      else clearTimeout(timer); // tab hidden: pause
    }

    scheduleNext();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      // Clean up when the page closes, so nothing keeps asking in the background.
      stopped = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [intervalMs, enabled]);
}
