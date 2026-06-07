import { notFound } from "next/navigation";
import { getEditionBySlug } from "@/db/queries/reference";
import { listClasses } from "@/db/queries/admin-classes";
import { listSkillsByEdition } from "@/db/queries/admin-skills";
import { AdminBreadcrumb } from "../_components/breadcrumb";
import { ClassesClient } from "./_classes-client";

export default async function ClassesPage({ params }: { params: Promise<{ editionSlug: string }> }) {
  const { editionSlug } = await params;
  const edition = await getEditionBySlug(editionSlug);
  if (!edition) notFound();

  const [classes, skills] = await Promise.all([
    listClasses(edition.id),
    listSkillsByEdition(edition.id),
  ]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <AdminBreadcrumb
        crumbs={[
          { label: "Admin", href: "/dashboard/admin" },
          { label: "Manage Data", href: "/dashboard/admin/data" },
          { label: edition.name, href: `/dashboard/admin/data/${editionSlug}` },
          { label: "Classes" },
        ]}
      />
      <ClassesClient edition={edition} initialClasses={classes} allSkills={skills} />
    </div>
  );
}
