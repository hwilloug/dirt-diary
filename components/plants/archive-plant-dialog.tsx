"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plant } from "@/types/plant";

interface ArchivePlantDialogProps {
  plant: Plant;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onArchive: (id: string, reason: string) => void;
}

export function ArchivePlantDialog({
  plant,
  open,
  onOpenChange,
  onArchive,
}: ArchivePlantDialogProps) {
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onArchive(plant.id, reason);
    onOpenChange(false);
    setReason("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Archive {plant.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for archiving</Label>
            <Textarea
              id="reason"
              placeholder="e.g., End of growing season, Plant died, etc."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Archive Plant</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}