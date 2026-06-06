import Link from "next/link";
import { Building2, Users } from "lucide-react";

const tiles = [
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

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
        {tiles.map(({ label, description, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="card-hover flex flex-col items-center justify-center gap-3 rounded-[var(--r-lg)] border text-center"
            style={{
              padding: "36px 24px",
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
              boxShadow: "var(--sh-sm)",
            }}
          >
            <div
              className="flex items-center justify-center rounded-[var(--r)] shrink-0"
              style={{ width: 52, height: 52, backgroundColor: "var(--accent-bg)" }}
            >
              <Icon size={26} style={{ color: "var(--sf-accent)" }} />
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 17, color: "var(--text-1)" }}>
                {label}
              </p>
              <p className="mt-1" style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-2)" }}>
                {description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
