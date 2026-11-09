"use client";

import { useCallback, useEffect, useState } from "react";
import { useChatStore, useReadingDm } from "@/components/ChatStore";
import { useToast } from "@/components/Toast";
import { ApiError, getDmMessages, sendDm, type Message } from "@/lib/api";
import { mergeMessages, pollAfter } from "@/lib/format";
import { usePolling } from "./usePolling";

/** How often an open DM asks the server for new messages (spec: 3–5 seconds). */
const POLL_MS = 4000;

/**
 * Where a DM is:
 *   loading → asking the server
 *   ready   → messages loaded
 *   blocked → 403: one of you blocked the other, the conversation is hidden
 *   gone    → 404: that user doesn't exist (anymore, e.g. deleted after 24h)
 *   error   → something else went wrong (e.g. no internet)
 */
export type DmStatus = "loading" | "ready" | "blocked" | "gone" | "error";

/**
 * Everything one DM chat needs, from the real API: its messages (loaded, then polled
 * every 4 seconds) and a send function. Used by the DM page and the mini chat card.
 * `enabled = false` skips all requests (e.g. when the username is you).
 */
export function useDmChat(username: string, enabled = true) {
  const { refreshDms, blocked } = useChatStore();
  const showToast = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<DmStatus>("loading");

  // While this chat is on screen, it counts as read.
  useReadingDm(username, messages.at(-1)?.created_at);

  const statusFromError = (error: unknown): DmStatus =>
    error instanceof ApiError && error.status === 403
      ? "blocked"
      : error instanceof ApiError && error.status === 404
        ? "gone"
        : "error";

  // Load the latest messages. State changes only when the server's answer arrives.
  const load = useCallback(
    () =>
      getDmMessages(username).then(
        (list) => {
          setMessages(list);
          setStatus("ready");
        },
        (error) => setStatus(statusFromError(error)),
      ),
    [username],
  );

  // Load when the chat opens, and again when your blocked list changes
  // (after a block the server answers 403, after an unblock the messages come back).
  useEffect(() => {
    if (enabled) load();
  }, [enabled, load, blocked]);

  // POLLING: every 4 seconds, ask for messages after the newest one we have.
  async function checkForNewMessages() {
    try {
      const fresh = await getDmMessages(username, pollAfter(messages));
      setMessages((current) => mergeMessages(current, fresh));
    } catch (error) {
      const next = statusFromError(error);
      if (next !== "error") setStatus(next); // blocked or gone while open; other errors: try again next time
    }
  }
  usePolling(checkForNewMessages, POLL_MS, enabled && status === "ready");

  /** Sends the message. Gives back false if it didn't go (the message box then keeps the text). */
  async function send(body: string) {
    try {
      const sent = await sendDm(username, body); // saved on the server
      setMessages((current) => mergeMessages(current, [sent]));
      refreshDms(); // update the DM list (this conversation moves to the top)
      return true;
    } catch (error) {
      const next = statusFromError(error);
      if (next === "blocked" || next === "gone") {
        setStatus(next);
      } else {
        showToast({
          message: `Message not sent: ${error instanceof ApiError ? error.message : "please try again."}`,
        });
      }
      return false;
    }
  }

  return { messages, status, send, retry: load };
}
