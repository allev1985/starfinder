"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type AppBarConfig = {
  title: string;
  subtitle?: string;
  backHref?: string;
};

type CampaignContext = {
  campaignId?: string;
  hasSpaceships?: boolean;
};

type AppBarContextValue = {
  config: AppBarConfig;
  setConfig: (config: AppBarConfig) => void;
  campaign: CampaignContext;
  setCampaign: (ctx: CampaignContext) => void;
};

const AppBarContext = createContext<AppBarContextValue>({
  config: { title: "" },
  setConfig: () => {},
  campaign: {},
  setCampaign: () => {},
});

export function AppBarProvider({
  children,
  initialCampaign,
}: {
  children: ReactNode;
  initialCampaign?: CampaignContext;
}) {
  const [config, setConfig] = useState<AppBarConfig>({ title: "Starfinder Campaigns" });
  const [campaign, setCampaign] = useState<CampaignContext>(initialCampaign ?? {});

  return (
    <AppBarContext.Provider value={{ config, setConfig, campaign, setCampaign }}>
      {children}
    </AppBarContext.Provider>
  );
}

export function useAppBar() {
  return useContext(AppBarContext);
}

export function useSetAppBar(config: AppBarConfig) {
  const { setConfig } = useContext(AppBarContext);
  useEffect(() => {
    setConfig(config);
    return () => setConfig({ title: "Starfinder Campaigns" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.title, config.subtitle, config.backHref]);
}
