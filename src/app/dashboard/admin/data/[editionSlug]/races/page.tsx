import { notFound } from "next/navigation";
import { getEditionBySlug } from "@/db/queries/reference";
import { listRaces } from "@/db/queries/admin-races";
import { AdminBreadcrumb } from "../_components/breadcrumb";
import { RacesClient } from "./_races-client";

export default async function RacesPage({ params }: { params: Promise<{ editionSlug: string }> }) {
  const { editionSlug } = await params;
  const edition = await getEditionBySlug(editionSlug);
  if (!edition) notFound();

  const races = await listRaces(edition.id);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <AdminBreadcrumb
        crumbs={[
          { label: "Admin", href: "/dashboard/admin" },
          { label: "Manage Data", href: "/dashboard/admin/data" },
          { label: edition.name, href: `/dashboard/admin/data/${editionSlug}` },
          { label: "Races" },
        ]}
      />
      <RacesClient edition={edition} initialRaces={races} />
    </div>
  );
}
