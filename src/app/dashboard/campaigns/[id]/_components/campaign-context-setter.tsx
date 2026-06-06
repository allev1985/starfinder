"use client";

import { useEffect } from "react";
import { useAppBar } from "@/components/app-bar-context";

export default function CampaignContextSetter({
  campaignId,
  hasSpaceships,
}: {
  campaignId: string;
  hasSpaceships?: boolean;
}) {
  const { setCampaign } = useAppBar();

  useEffect(() => {
    setCampaign({ campaignId, hasSpaceships });
    return () => setCampaign({});
  }, [campaignId, hasSpaceships, setCampaign]);

  return null;
}
