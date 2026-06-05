"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSpaceshipAction } from "./actions";

export default function CreateSpaceshipForm({ campaignId }: { campaignId: string }) {
  const ref = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    const name = (formData.get("name") as string).trim();
    if (!name) return;
    await createSpaceshipAction(campaignId, name);
    ref.current?.reset();
  }

  return (
    <form ref={ref} action={handleSubmit} className="flex flex-col gap-4 max-w-sm">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="spaceship-name">Ship name</Label>
        <Input
          id="spaceship-name"
          name="name"
          placeholder="e.g. Sunrise Maiden"
          required
          autoFocus
        />
      </div>
      <Button type="submit">Create spaceship</Button>
    </form>
  );
}
