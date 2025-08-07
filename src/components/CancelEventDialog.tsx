import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface CancelEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function CancelEventDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false
}: CancelEventDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:rounded-2xl gap-2 p-4">
        <DialogHeader>
          <DialogTitle>Cancel Event</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this event? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Nevermind
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Cancelling..." : "Cancel Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}