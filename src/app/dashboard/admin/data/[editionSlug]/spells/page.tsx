import { notFound } from "next/navigation";
import { getEditionBySlug } from "@/db/queries/reference";
import { listSpells } from "@/db/queries/admin-spells";
import { AdminBreadcrumb } from "../_components/breadcrumb";
import { SpellsClient } from "./_spells-client";

export default async function SpellsPage({ params }: { params: Promise<{ editionSlug: string }> }) {
  const { editionSlug } = await params;
  const edition = await getEditionBySlug(editionSlug);
  if (!edition) notFound();

  const spells = await listSpells(edition.id);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <AdminBreadcrumb
        crumbs={[
          { label: "Admin", href: "/dashboard/admin" },
          { label: "Manage Data", href: "/dashboard/admin/data" },
          { label: edition.name, href: `/dashboard/admin/data/${editionSlug}` },
          { label: "Spells" },
        ]}
      />
      <SpellsClient edition={edition} initialSpells={spells} />
    </div>
  );
}
