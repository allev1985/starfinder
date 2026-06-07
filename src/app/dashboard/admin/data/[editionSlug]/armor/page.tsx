import { notFound } from "next/navigation";
import { getEditionBySlug } from "@/db/queries/reference";
import { listArmor } from "@/db/queries/admin-armor";
import { AdminBreadcrumb } from "../_components/breadcrumb";
import { ArmorClient } from "./_armor-client";

export default async function ArmorPage({ params }: { params: Promise<{ editionSlug: string }> }) {
  const { editionSlug } = await params;
  const edition = await getEditionBySlug(editionSlug);
  if (!edition) notFound();

  const armorItems = await listArmor(edition.id);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <AdminBreadcrumb
        crumbs={[
          { label: "Admin", href: "/dashboard/admin" },
          { label: "Manage Data", href: "/dashboard/admin/data" },
          { label: edition.name, href: `/dashboard/admin/data/${editionSlug}` },
          { label: "Armor" },
        ]}
      />
      <ArmorClient edition={edition} initialArmor={armorItems} />
    </div>
  );
}
