"use client";

import { useSetAppBar } from "@/components/app-bar-context";

export default function SpaceshipAppBar({ shipName, tier }: { shipName: string; tier: string }) {
  useSetAppBar({ title: shipName, subtitle: tier ? `TIER ${tier}` : "STARSHIP" });
  return null;
}
