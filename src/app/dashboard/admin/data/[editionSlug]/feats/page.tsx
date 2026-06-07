import { notFound } from "next/navigation";
import { getEditionBySlug } from "@/db/queries/reference";
import { listFeats } from "@/db/queries/admin-feats";
import { AdminBreadcrumb } from "../_components/breadcrumb";
import { FeatsClient } from "./_feats-client";

export default async function FeatsPage({ params }: { params: Promise<{ editionSlug: string }> }) {
  const { editionSlug } = await params;
  const edition = await getEditionBySlug(editionSlug);
  if (!edition) notFound();

  const feats = await listFeats(edition.id);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <AdminBreadcrumb
        crumbs={[
          { label: "Admin", href: "/dashboard/admin" },
          { label: "Manage Data", href: "/dashboard/admin/data" },
          { label: edition.name, href: `/dashboard/admin/data/${editionSlug}` },
          { label: "Feats" },
        ]}
      />
      <FeatsClient edition={edition} initialFeats={feats} />
    </div>
  );
}
