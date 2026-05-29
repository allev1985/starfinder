"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { joinCampaignAction } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function JoinCampaignForm({ characterId }: { characterId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await joinCampaignAction(characterId, new FormData(e.currentTarget));
    setLoading(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    (e.target as HTMLFormElement).reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <Label htmlFor="joinCode">Join code</Label>
        <div className="flex gap-2">
          <Input
            id="joinCode"
            name="joinCode"
            placeholder="XK4R9P"
            className="font-mono uppercase"
            maxLength={6}
          />
          <Button type="submit" disabled={loading} className="shrink-0">
            {loading ? "Joining…" : "Join"}
          </Button>
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </form>
  );
}
