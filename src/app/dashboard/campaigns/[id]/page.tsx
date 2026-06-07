import Link from "next/link";
import { redirect } from "next/navigation";
import { Dices, NotebookText, Rocket } from "lucide-react";
import { getUser } from "@/lib/session";
import { getCampaignWithCharacters, getPartyMembers, getSpaceshipsByCampaign } from "@/db/queries/campaigns";
import Avatar from "@/components/avatar";
import Pill from "@/components/pill";
import CampaignActions from "./_components/campaign-actions";
import CampaignDetailHeader from "./_components/campaign-detail-header";

function SectionLabel({ children }: { children: string }) {
  return (
    <p
      className="uppercase tracking-[0.1em] mb-2"
      style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)" }}
    >
      {children}
    </p>
  );
}

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  if (!user) redirect("/");

  const [{ campaign }, party, spaceships] = await Promise.all([
    getCampaignWithCharacters(id),
    getPartyMembers(id),
    getSpaceshipsByCampaign(id),
  ]);
  if (!campaign) redirect("/dashboard/campaigns");

  const isDm = campaign.dmId === user.id;

  return (
    <div className="p-5 max-w-2xl mx-auto w-full">
      <CampaignDetailHeader name={campaign.name} />

      {/* Heading */}
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 26, color: "var(--text-1)" }}>
            {campaign.name}
          </h1>
          {isDm && <Pill variant="dm">DM</Pill>}
        </div>
        {isDm && <CampaignActions campaignId={id} />}
      </div>

      {/* Join code */}
      <div className="flex items-center gap-2 mb-6">
        <span
          className="uppercase tracking-[0.08em]"
          style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)" }}
        >
          Join code:
        </span>
        <Pill variant="code">{campaign.joinCode}</Pill>
      </div>

      {/* Party */}
      <div className="mb-6">
        <SectionLabel>Party</SectionLabel>
        {party.length === 0 ? (
          <p style={{ fontSize: 13, color: "var(--text-3)" }}>No characters yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {party.map((member) => {
              const hpPct = member.hitPointsTotal > 0
                ? Math.min(100, Math.round((member.hitPointsCurrent / member.hitPointsTotal) * 100))
                : 0;
              return (
                <Link
                  key={member.id}
                  href={`/dashboard/campaigns/${id}/characters/${member.id}`}
                  className="card-hover flex items-center gap-3 rounded-[var(--r)]"
                  style={{
                    padding: "12px 14px",
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <Avatar name={member.name} size={44} radius={12} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 14, color: "var(--text-1)" }}>
                        {member.name}
                      </span>
                      {member.className && (
                        <span style={{ fontSize: 12, color: "var(--text-2)" }}>{member.className}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-[6px]">
                      <div
                        className="flex-1 relative overflow-hidden"
                        style={{ height: 6, borderRadius: 99, backgroundColor: "var(--surface-2)", border: "1px solid var(--border)" }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            width: `${hpPct}%`,
                            backgroundColor: "var(--good)",
                            borderRadius: 99,
                          }}
                        />
                      </div>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-2)", flexShrink: 0 }}>
                        {member.hitPointsCurrent}/{member.hitPointsTotal}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Starships */}
      {spaceships.length > 0 && (
        <div className="mb-6">
          <SectionLabel>Starship</SectionLabel>
          <div className="flex flex-col gap-2">
            {spaceships.map((ship) => (
              <Link
                key={ship.id}
                href={`/dashboard/campaigns/${id}/spaceship/${ship.id}`}
                className="card-hover flex items-center gap-3 rounded-[var(--r)]"
                style={{
                  padding: "12px 14px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  className="flex items-center justify-center rounded-[12px]"
                  style={{ width: 44, height: 44, backgroundColor: "var(--chrome)", color: "var(--accent-bright)", flexShrink: 0 }}
                >
                  <Rocket size={20} />
                </div>
                <div className="flex-1">
                  <span style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 14, color: "var(--text-1)" }}>
                    {ship.name}
                  </span>
                  <p style={{ fontSize: 12, color: "var(--text-2)", marginTop: 2 }}>
                    Hull {ship.hullCurrent}/{ship.hullTotal} · Shields{" "}
                    {(ship.shieldForwardCurrent ?? 0) + (ship.shieldPortCurrent ?? 0) + (ship.shieldStarboardCurrent ?? 0) + (ship.shieldAftCurrent ?? 0)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Encounter */}
      <div className="mb-6">
        <SectionLabel>Encounter</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="encounter-btn flex flex-col items-center justify-center gap-2 rounded-[var(--r)] transition-colors"
            style={{
              padding: "16px 12px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              cursor: "default",
            }}
          >
            <Dices size={22} style={{ color: "var(--sf-accent)" }} />
            <span style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, color: "var(--text-1)" }}>
              Initiative
            </span>
          </button>
          <Link
            href={`/dashboard/campaigns/${id}/sessions`}
            className="card-hover flex flex-col items-center justify-center gap-2 rounded-[var(--r)]"
            style={{
              padding: "16px 12px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <NotebookText size={22} style={{ color: "var(--sf-accent)" }} />
            <span style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, color: "var(--text-1)" }}>
              Session notes
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
