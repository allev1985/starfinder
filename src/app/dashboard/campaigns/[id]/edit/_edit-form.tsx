"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateCampaignAction, regenerateJoinCodeAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Campaign } from "@/db/schema";

export default function EditCampaignForm({ campaign }: { campaign: Campaign }) {
  const router = useRouter();
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameSaving, setNameSaving] = useState(false);
  const [joinCode, setJoinCode] = useState(campaign.joinCode);
  const [regenerating, setRegenerating] = useState(false);
  const [regenerateError, setRegenerateError] = useState<string | null>(null);

  async function handleNameSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNameError(null);
    setNameSaving(true);
    const result = await updateCampaignAction(campaign.id, new FormData(e.currentTarget));
    setNameSaving(false);
    if (!result.success) {
      setNameError(result.error);
      return;
    }
    router.push(`/dashboard/campaigns/${campaign.id}`);
  }

  async function handleRegenerate() {
    setRegenerateError(null);
    setRegenerating(true);
    const result = await regenerateJoinCodeAction(campaign.id);
    setRegenerating(false);
    if (!result.success) {
      setRegenerateError(result.error);
      return;
    }
    setJoinCode(result.data);
  }

  return (
    <div className="flex flex-col gap-6 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Campaign name</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleNameSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={campaign.name}
                required
                autoFocus
              />
            </div>
            {nameError && <p className="text-sm text-destructive">{nameError}</p>}
            <div className="flex gap-2">
              <Button type="submit" disabled={nameSaving}>
                {nameSaving ? "Saving…" : "Save"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push(`/dashboard/campaigns/${campaign.id}`)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Join code</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="font-mono text-lg font-semibold tracking-widest">{joinCode}</p>
          <p className="text-sm text-muted-foreground">
            Regenerating creates a new code. Existing links will no longer work.
          </p>
          {regenerateError && (
            <p className="text-sm text-destructive">{regenerateError}</p>
          )}
          <Button
            variant="outline"
            onClick={handleRegenerate}
            disabled={regenerating}
            className="w-fit"
          >
            {regenerating ? "Regenerating…" : "Regenerate join code"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
