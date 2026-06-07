import { notFound } from "next/navigation";
import { getEditionBySlug } from "@/db/queries/reference";
import { listThemes } from "@/db/queries/admin-themes";
import { AdminBreadcrumb } from "../_components/breadcrumb";
import { ThemesClient } from "./_themes-client";

export default async function ThemesPage({ params }: { params: Promise<{ editionSlug: string }> }) {
  const { editionSlug } = await params;
  const edition = await getEditionBySlug(editionSlug);
  if (!edition) notFound();

  const themes = await listThemes(edition.id);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <AdminBreadcrumb
        crumbs={[
          { label: "Admin", href: "/dashboard/admin" },
          { label: "Manage Data", href: "/dashboard/admin/data" },
          { label: edition.name, href: `/dashboard/admin/data/${editionSlug}` },
          { label: "Themes" },
        ]}
      />
      <ThemesClient edition={edition} initialThemes={themes} />
    </div>
  );
}
