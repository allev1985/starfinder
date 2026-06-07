import Link from "next/link";
import { listEditions } from "@/db/queries/admin-editions";
import { AddEditionButton } from "./_add-edition-button";

export default async function EditionsPage() {
  const editions = await listEditions();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <nav className="flex items-center gap-1 text-sm mb-6" style={{ color: "var(--text-2)" }}>
        <Link href="/dashboard/admin" className="hover:underline" style={{ color: "var(--sf-accent)" }}>Admin</Link>
        <span style={{ color: "var(--border)" }}>›</span>
        <span style={{ color: "var(--text-1)", fontWeight: 600 }}>Manage Data</span>
      </nav>

      <div className="flex items-center justify-between mb-6">
        <h1 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 22, color: "var(--text-1)" }}>
          Editions
        </h1>
        <AddEditionButton />
      </div>

      {editions.length === 0 ? (
        <p style={{ color: "var(--text-2)", fontSize: 14 }}>No editions yet. Create one to get started.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {editions.map((edition) => (
            <Link
              key={edition.id}
              href={`/dashboard/admin/data/${edition.slug}`}
              className="card-hover flex items-center justify-between rounded-[var(--r)] border px-5 py-4"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
            >
              <div>
                <p style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 16, color: "var(--text-1)" }}>
                  {edition.name}
                </p>
                <p style={{ fontSize: 12, color: "var(--text-2)" }}>{edition.slug}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
