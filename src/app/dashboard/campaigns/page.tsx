import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/session";
import { listCampaignsForUser } from "@/services/campaigns";
import { Badge } from "@/components/ui/badge";

export default async function CampaignsPage() {
  const user = await getUser();
  if (!user) redirect("/");

  const campaigns = await listCampaignsForUser(user.id);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Campaigns</h1>
        <Link
          href="/dashboard/campaigns/new"
          className="text-sm font-medium underline-offset-4 hover:underline"
        >
          + New
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No campaigns yet.{" "}
          <Link href="/dashboard/campaigns/new" className="underline underline-offset-4">
            Create one
          </Link>{" "}
          or ask a DM for a join code.
        </p>
      ) : (
        <ul className="flex flex-col divide-y">
          {campaigns.map((campaign) => (
            <li key={campaign.id}>
              <Link
                href={`/dashboard/campaigns/${campaign.id}`}
                className="flex items-center justify-between py-3 hover:text-foreground/80"
              >
                <span className="text-sm font-medium">{campaign.name}</span>
                <Badge variant={campaign.role === "dm" ? "default" : "secondary"}>
                  {campaign.role === "dm" ? "DM" : "Player"}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
