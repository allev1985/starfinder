import { notFound } from "next/navigation";
import { getEditionBySlug } from "@/db/queries/reference";
import { listEquipment } from "@/db/queries/admin-equipment";
import { AdminBreadcrumb } from "../_components/breadcrumb";
import { EquipmentClient } from "./_equipment-client";

export default async function EquipmentPage({ params }: { params: Promise<{ editionSlug: string }> }) {
  const { editionSlug } = await params;
  const edition = await getEditionBySlug(editionSlug);
  if (!edition) notFound();

  const items = await listEquipment();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <AdminBreadcrumb
        crumbs={[
          { label: "Admin", href: "/dashboard/admin" },
          { label: "Manage Data", href: "/dashboard/admin/data" },
          { label: edition.name, href: `/dashboard/admin/data/${editionSlug}` },
          { label: "Equipment" },
        ]}
      />
      <EquipmentClient initialEquipment={items} />
    </div>
  );
}
