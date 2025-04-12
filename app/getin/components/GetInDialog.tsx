'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface GetInDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function GetInDialog({ isOpen, onClose, onConfirm }: GetInDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New User</DialogTitle>
          <DialogDescription>
            We noticed this is your first time logging in. Would you like to complete your profile now?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Later</Button>
          <Button onClick={onConfirm}>Complete Profile</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}