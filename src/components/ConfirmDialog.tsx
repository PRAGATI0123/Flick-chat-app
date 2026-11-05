"use client";

import { Button } from "./Button";
import { Modal } from "./Modal";

type ConfirmDialogProps = {
  title: string;
  message: string;
  /** Text on the red button, e.g. "Block". */
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

/** "Are you sure?" popup with Cancel and a red confirm button. */
export function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="mt-2 text-sm text-muted">{message}</p>
      <div className="mt-6 flex justify-end gap-2">
        {/* autoFocus on Cancel, so pressing Enter by accident doesn't confirm */}
        <Button variant="secondary" onClick={onCancel} autoFocus>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

/** The "are you sure?" popup for blocking someone (chat menu and the DM's Block button). */
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
