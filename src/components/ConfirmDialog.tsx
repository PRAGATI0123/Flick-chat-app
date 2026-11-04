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
