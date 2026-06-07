import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronRight, Plus } from "lucide-react";
import { getUser } from "@/lib/session";
import { listCampaignsForUser } from "@/services/campaigns";
import Avatar from "@/components/avatar";
import Pill from "@/components/pill";

export default async function CampaignsPage() {
  const user = await getUser();
  if (!user) redirect("/");

  const campaigns = await listCampaignsForUser(user.id);

  return (
    <div className="p-5 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 24, color: "var(--text-1)" }}>
            Campaigns
          </h1>
          <p
            className="uppercase tracking-[0.08em] mt-[2px]"
            style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}
          >
            {campaigns.length} {campaigns.length === 1 ? "campaign" : "campaigns"}
          </p>
        </div>
        <Link
          href="/dashboard/campaigns/new"
          className="hidden md:flex items-center gap-1 px-3 py-2 rounded-[var(--r-sm)] text-sm font-semibold transition-colors"
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 13,
            fontWeight: 600,
            backgroundColor: "var(--sf-accent)",
            color: "#fff",
          }}
        >
          <Plus size={14} />
          New
        </Link>
      </div>

      {/* List */}
      {campaigns.length === 0 ? (
        <p style={{ fontSize: 14, color: "var(--text-2)" }}>
          No campaigns yet.{" "}
          <Link href="/dashboard/campaigns/new" style={{ color: "var(--sf-accent)", textDecoration: "underline" }}>
            Create one
          </Link>{" "}
          or ask a GM for a join code.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {campaigns.map((campaign) => (
            <li key={campaign.id}>
              <Link
                href={`/dashboard/campaigns/${campaign.id}`}
                className="card-hover flex items-center gap-[13px] rounded-[var(--r)]"
                style={{
                  padding: 14,
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--sh-xs)",
                }}
              >
                <Avatar name={campaign.name} size={46} radius={12} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 15, color: "var(--text-1)" }}>
                      {campaign.name}
                    </span>
                    {campaign.role === "gm" && <Pill variant="gm">GM</Pill>}
                    <Pill variant="code">{campaign.joinCode}</Pill>
                  </div>
                </div>
                <ChevronRight size={18} style={{ color: "var(--text-3)", flexShrink: 0 }} />
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Mobile FAB */}
      <Link
        href="/dashboard/campaigns/new"
        className="md:hidden fixed flex items-center justify-center rounded-full z-40"
        style={{
          width: 54,
          height: 54,
          bottom: 82,
          right: 18,
          backgroundColor: "var(--sf-accent)",
          color: "#fff",
          boxShadow: "var(--sh-md)",
        }}
      >
        <Plus size={24} />
      </Link>
    </div>
  );
}
