import { notFound } from "next/navigation";
import { getEditionBySlug } from "@/db/queries/reference";
import { listChassis } from "@/db/queries/admin-chassis";
import { listSkillsByEdition } from "@/db/queries/admin-skills";
import { AdminBreadcrumb } from "../_components/breadcrumb";
import { ChassisClient } from "./_chassis-client";

export default async function ChassisPage({ params }: { params: Promise<{ editionSlug: string }> }) {
  const { editionSlug } = await params;
  const edition = await getEditionBySlug(editionSlug);
  if (!edition) notFound();

  const [chassisItems, skills] = await Promise.all([
    listChassis(edition.id),
    listSkillsByEdition(edition.id),
  ]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <AdminBreadcrumb
        crumbs={[
          { label: "Admin", href: "/dashboard/admin" },
          { label: "Manage Data", href: "/dashboard/admin/data" },
          { label: edition.name, href: `/dashboard/admin/data/${editionSlug}` },
          { label: "Chassis" },
        ]}
      />
      <ChassisClient edition={edition} initialChassis={chassisItems} allSkills={skills} />
    </div>
  );
}
