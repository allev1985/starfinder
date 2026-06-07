import { notFound } from "next/navigation";
import { getEditionBySlug } from "@/db/queries/reference";
import { listWeapons } from "@/db/queries/admin-weapons";
import { AdminBreadcrumb } from "../_components/breadcrumb";
import { WeaponsClient } from "./_weapons-client";

export default async function WeaponsPage({ params }: { params: Promise<{ editionSlug: string }> }) {
  const { editionSlug } = await params;
  const edition = await getEditionBySlug(editionSlug);
  if (!edition) notFound();

  const weapons = await listWeapons(edition.id);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <AdminBreadcrumb
        crumbs={[
          { label: "Admin", href: "/dashboard/admin" },
          { label: "Manage Data", href: "/dashboard/admin/data" },
          { label: edition.name, href: `/dashboard/admin/data/${editionSlug}` },
          { label: "Weapons" },
        ]}
      />
      <WeaponsClient edition={edition} initialWeapons={weapons} />
    </div>
  );
}
