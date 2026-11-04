"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { useChatStore } from "./ChatStore";
import { ConfirmDialog } from "./ConfirmDialog";
import { Modal } from "./Modal";
import { useToast } from "./Toast";

/**
 * Opens when you click a username in a chat: "Direct message" or "Block".
 * Choosing Block asks once more before blocking.
 */
export function UserDialog({ username, onClose }: { username: string; onClose: () => void }) {
  const router = useRouter();
  const { block, unblock } = useChatStore();
  const showToast = useToast();
  const [confirmingBlock, setConfirmingBlock] = useState(false);

  if (confirmingBlock) {
    return (
      <BlockConfirmDialog
        username={username}
        onConfirm={() => {
          block(username);
          showToast({ message: `@${username} blocked`, actionLabel: "Undo", onAction: () => unblock(username) });
          onClose();
        }}
        onCancel={onClose}
      />
    );
  }

  return (
    <Modal title={`@${username}`} onClose={onClose}>
      <div className="mt-3 flex items-center gap-3">
        <Avatar name={username} />
        <p className="text-sm text-muted">What would you like to do?</p>
      </div>
      <div className="mt-6 flex flex-col gap-2">
        <Button
          onClick={() => {
            onClose();
            router.push(`/chat/directMsg/${username}`);
          }}
        >
          Send direct message
        </Button>
        <Button variant="danger" onClick={() => setConfirmingBlock(true)}>
          Block @{username}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}

/** The "are you sure?" step for blocking, also used by the Block button in a DM. */
export function BlockConfirmDialog({
  username,
  onConfirm,
  onCancel,
}: {
  username: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <ConfirmDialog
      title={`Block @${username}?`}
      message="You won't see their messages in any room or in your DMs anymore. You can unblock them later from Blocked users."
      confirmLabel="Block"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
