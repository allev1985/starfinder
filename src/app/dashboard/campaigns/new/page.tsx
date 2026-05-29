"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCampaignAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NewCampaignPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await createCampaignAction(new FormData(e.currentTarget));
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.push("/dashboard/campaigns");
  }

  return (
    <div className="flex flex-1 items-start justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>New Campaign</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Campaign name</Label>
              <Input
                id="name"
                name="name"
                placeholder="The Drift Crisis"
                required
                autoFocus
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={loading}>
              {loading ? "Creating…" : "Create campaign"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
