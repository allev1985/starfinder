import Link from "next/link";
import { Building2, Users, ShieldCheck } from "lucide-react";
import { getUser, isAdmin } from "@/lib/session";

const baseTiles = [
  {
    label: "Campaigns",
    description: "Manage your campaigns and party",
    icon: Building2,
    href: "/dashboard/campaigns",
  },
  {
    label: "Characters",
    description: "View and edit your characters",
    icon: Users,
    href: "/dashboard/characters",
  },
];

const adminTile = {
  label: "Admin",
  description: "Manage reference data and settings",
  icon: ShieldCheck,
  href: "/dashboard/admin",
};

export default async function DashboardPage() {
  const user = await getUser();
  const tiles = isAdmin(user) ? [...baseTiles, adminTile] : baseTiles;

  // Group tiles in sets of 3 so each snap page shows exactly 3
  const groups: (typeof tiles)[] = [];
  for (let i = 0; i < tiles.length; i += 3) {
    groups.push(tiles.slice(i, i + 3));
  }

  return (
    // On mobile: full-height snap-scroll container, one viewport per group of 3
    // On sm+: plain centered layout, no snap needed
    <div className="h-full overflow-y-auto sm:overflow-visible sm:flex sm:flex-col sm:items-center sm:justify-center sm:flex-1 snap-y snap-mandatory sm:snap-none">
      {groups.map((group, gi) => (
        <div
          key={gi}
          className="h-full snap-start sm:snap-align-none flex flex-col items-center justify-center gap-3 p-5 sm:p-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-lg">
            {group.map(({ label, description, icon: Icon, href }) => (
              <Link
                key={label}
                href={href}
                className="card-hover flex flex-col items-center justify-center gap-2 sm:gap-3 rounded-[var(--r-lg)] border text-center"
                style={{
                  padding: "18px 20px",
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                  boxShadow: "var(--sh-sm)",
                }}
              >
                <div
                  className="flex items-center justify-center rounded-[var(--r)] shrink-0"
                  style={{ width: 44, height: 44, backgroundColor: "var(--accent-bg)" }}
                >
                  <Icon size={22} style={{ color: "var(--sf-accent)" }} />
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 16, color: "var(--text-1)" }}>
                    {label}
                  </p>
                  <p className="mt-0.5" style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-2)" }}>
                    {description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
