"use client";

import { useSetAppBar } from "@/components/app-bar-context";

export default function CampaignDetailHeader({ name }: { name: string }) {
  useSetAppBar({ title: name, subtitle: "CAMPAIGN" });
  return null;
}
