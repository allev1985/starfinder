"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSpaceshipAction } from "./actions";

export default function CreateSpaceshipForm({ campaignId }: { campaignId: string }) {
  const ref = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    const name = (formData.get("name") as string).trim();
    if (!name) return;
    setError(null);
    const result = await createSpaceshipAction(campaignId, name);
    if (result.success) {
      ref.current?.reset();
      router.push(`/dashboard/campaigns/${campaignId}/spaceship/${result.shipId}`);
    } else {
      setError(result.error);
    }
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
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit">Create spaceship</Button>
    </form>
  );
}
