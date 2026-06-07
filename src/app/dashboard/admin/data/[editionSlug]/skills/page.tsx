import { notFound } from "next/navigation";
import { getEditionBySlug } from "@/db/queries/reference";
import { listSkillsByEdition } from "@/db/queries/admin-skills";
import { AdminBreadcrumb } from "../_components/breadcrumb";
import { SkillsClient } from "./_skills-client";

export default async function SkillsPage({ params }: { params: Promise<{ editionSlug: string }> }) {
  const { editionSlug } = await params;
  const edition = await getEditionBySlug(editionSlug);
  if (!edition) notFound();

  const skills = await listSkillsByEdition(edition.id);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <AdminBreadcrumb
        crumbs={[
          { label: "Admin", href: "/dashboard/admin" },
          { label: "Manage Data", href: "/dashboard/admin/data" },
          { label: edition.name, href: `/dashboard/admin/data/${editionSlug}` },
          { label: "Skills" },
        ]}
      />
      <SkillsClient edition={edition} initialSkills={skills} />
    </div>
  );
}
