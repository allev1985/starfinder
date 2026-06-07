"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSessionAction } from "./actions";

export default function CreateSessionDialog({ campaignId }: { campaignId: string }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    const title = (formData.get("title") as string | null)?.trim();
    if (!title) {
      setError("Title is required.");
      return;
    }
    setError(null);
    await createSessionAction(campaignId, formData);
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus size={15} />
        New session
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New session</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="session-title">Title *</Label>
            <Input
              id="session-title"
              name="title"
              placeholder="e.g. The Drift Incident"
              required
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="session-number">Session #</Label>
              <Input
                id="session-number"
                name="sessionNumber"
                type="number"
                placeholder="e.g. 4"
                min={1}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="session-date">Date</Label>
              <Input id="session-date" name="sessionDate" type="date" />
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </DialogContent>
      </Dialog>
    </>
  );
}
