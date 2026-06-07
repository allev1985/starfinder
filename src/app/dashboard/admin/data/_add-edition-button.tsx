"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createEdition } from "@/db/queries/admin-editions";

export function AddEditionButton() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!name.trim() || !slug.trim()) {
      setError("Name and slug are required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const result = await createEdition(name.trim(), slug.trim());
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
    } else {
      setName("");
      setSlug("");
      setOpen(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>+ Add Edition</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Edition</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-1">
              <Label htmlFor="edition-name">Name</Label>
              <Input
                id="edition-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Core Rulebook"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="edition-slug">Slug</Label>
              <Input
                id="edition-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="crb"
              />
              <p className="text-xs" style={{ color: "var(--text-2)" }}>
                Used in URLs. Must be unique and stable.
              </p>
            </div>
            {error && <p className="text-sm" style={{ color: "#ef4444" }}>{error}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Creating…" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
