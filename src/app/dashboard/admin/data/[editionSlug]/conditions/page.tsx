import { notFound } from "next/navigation";
import { getEditionBySlug } from "@/db/queries/reference";
import { listConditions } from "@/db/queries/admin-conditions";
import { AdminBreadcrumb } from "../_components/breadcrumb";
import { ConditionsClient } from "./_conditions-client";

export default async function ConditionsPage({ params }: { params: Promise<{ editionSlug: string }> }) {
  const { editionSlug } = await params;
  const edition = await getEditionBySlug(editionSlug);
  if (!edition) notFound();

  const conditions = await listConditions(edition.id);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <AdminBreadcrumb
        crumbs={[
          { label: "Admin", href: "/dashboard/admin" },
          { label: "Manage Data", href: "/dashboard/admin/data" },
          { label: edition.name, href: `/dashboard/admin/data/${editionSlug}` },
          { label: "Conditions" },
        ]}
      />
      <ConditionsClient edition={edition} initialConditions={conditions} />
    </div>
  );
}
