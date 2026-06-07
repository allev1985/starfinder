import { notFound } from "next/navigation";
import Link from "next/link";
import { getEditionBySlug } from "@/db/queries/reference";
import { AdminBreadcrumb } from "./_components/breadcrumb";
import {
  Users,
  BookOpen,
  Palette,
  Zap,
  Shield,
  Swords,
  Package,
  Sparkles,
  Star,
  Cpu,
} from "lucide-react";

const categories = [
  { label: "Races", slug: "races", icon: Users },
  { label: "Classes", slug: "classes", icon: BookOpen },
  { label: "Themes", slug: "themes", icon: Palette },
  { label: "Skills", slug: "skills", icon: Zap },
  { label: "Armor", slug: "armor", icon: Shield },
  { label: "Weapons", slug: "weapons", icon: Swords },
  { label: "Equipment", slug: "equipment", icon: Package },
  { label: "Spells", slug: "spells", icon: Sparkles },
  { label: "Feats", slug: "feats", icon: Star },
  { label: "Chassis", slug: "chassis", icon: Cpu },
];

export default async function EditionDataPage({ params }: { params: Promise<{ editionSlug: string }> }) {
  const { editionSlug } = await params;
  const edition = await getEditionBySlug(editionSlug);
  if (!edition) notFound();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <AdminBreadcrumb
        crumbs={[
          { label: "Admin", href: "/dashboard/admin" },
          { label: "Manage Data", href: "/dashboard/admin/data" },
          { label: edition.name },
        ]}
      />
      <h1 className="mb-6" style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 22, color: "var(--text-1)" }}>
        {edition.name}
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {categories.map(({ label, slug, icon: Icon }) => (
          <Link
            key={slug}
            href={`/dashboard/admin/data/${editionSlug}/${slug}`}
            className="card-hover flex flex-col items-center justify-center gap-2 rounded-[var(--r-lg)] border text-center"
            style={{
              padding: "28px 16px",
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
              boxShadow: "var(--sh-sm)",
            }}
          >
            <div
              className="flex items-center justify-center rounded-[var(--r)] shrink-0"
              style={{ width: 40, height: 40, backgroundColor: "var(--accent-bg)" }}
            >
              <Icon size={20} style={{ color: "var(--sf-accent)" }} />
            </div>
            <p style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 14, color: "var(--text-1)" }}>
              {label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
