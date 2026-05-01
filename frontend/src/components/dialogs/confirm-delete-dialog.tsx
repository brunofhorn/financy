import { Loader2, Trash2 } from "lucide-react";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

type ConfirmDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  itemName?: string;
  confirmLabel?: string;
  isDeleting?: boolean;
  onConfirm: () => void | Promise<void>;
};

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  itemName,
  confirmLabel = "Excluir",
  isDeleting,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  async function handleConfirm() {
    await onConfirm();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[360px] gap-5 rounded-lg border-[#e2e5e9] p-6 shadow-[0_16px_40px_rgba(17,24,39,0.18)]">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-finance-red-light text-feedback-danger">
          <Trash2 className="h-5 w-5" />
        </div>

        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-[#111827]">{title}</DialogTitle>
          <DialogDescription className="text-sm leading-6 text-[#4b5563]">
            {description}
          </DialogDescription>
        </DialogHeader>

        {itemName ? (
          <div className="rounded-lg border border-[#e2e5e9] bg-[#f7f8fa] px-3 py-2 text-sm font-semibold text-[#111827]">
            {itemName}
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="secondary"
            className="h-10 rounded-lg"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="h-10 rounded-lg"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
