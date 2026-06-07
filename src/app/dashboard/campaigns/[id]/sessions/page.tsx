import Link from "next/link";
import { redirect } from "next/navigation";
import { NotebookText } from "lucide-react";
import { getUser } from "@/lib/session";
import { getCampaignWithCharacters } from "@/db/queries/campaigns";
import { listSessionsByCampaign } from "./actions";
import CreateSessionDialog from "./_create-session-dialog";

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default async function SessionsListPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  if (!user) redirect("/");

  const [{ campaign }, sessions] = await Promise.all([
    getCampaignWithCharacters(id),
    listSessionsByCampaign(id),
  ]);
  if (!campaign) redirect("/dashboard/campaigns");

  return (
    <div className="p-5 max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h1
          style={{
            fontFamily: "var(--font-ui)",
            fontWeight: 700,
            fontSize: 22,
            color: "var(--text-1)",
          }}
        >
          Session Notes
        </h1>
        <CreateSessionDialog campaignId={id} />
      </div>

      {sessions.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center gap-3 rounded-[var(--r)] py-16"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <NotebookText size={32} style={{ color: "var(--text-3)" }} />
          <p style={{ fontSize: 14, color: "var(--text-2)" }}>No sessions yet.</p>
          <p style={{ fontSize: 13, color: "var(--text-3)" }}>
            Create the first session to start keeping notes.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {sessions.map((session) => (
            <Link
              key={session.id}
              href={`/dashboard/campaigns/${id}/sessions/${session.id}`}
              className="card-hover flex items-center gap-3 rounded-[var(--r)]"
              style={{
                padding: "14px 16px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                className="flex items-center justify-center rounded-[10px] shrink-0"
                style={{ width: 40, height: 40, backgroundColor: "var(--chrome)", color: "var(--accent-bright)" }}
              >
                <NotebookText size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  {session.sessionNumber != null && (
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: "var(--text-3)",
                      }}
                    >
                      #{session.sessionNumber}
                    </span>
                  )}
                  <span
                    style={{
                      fontFamily: "var(--font-ui)",
                      fontWeight: 600,
                      fontSize: 14,
                      color: "var(--text-1)",
                    }}
                  >
                    {session.title}
                  </span>
                </div>
                {session.sessionDate && (
                  <p style={{ fontSize: 12, color: "var(--text-2)", marginTop: 2 }}>
                    {formatDate(session.sessionDate)}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
