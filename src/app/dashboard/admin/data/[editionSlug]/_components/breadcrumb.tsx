import Link from "next/link";

interface Crumb {
  label: string;
  href?: string;
}

interface AdminBreadcrumbProps {
  crumbs: Crumb[];
}

export function AdminBreadcrumb({ crumbs }: AdminBreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1 text-sm mb-6" style={{ color: "var(--text-2)" }}>
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span style={{ color: "var(--border)" }}>›</span>}
          {crumb.href ? (
            <Link href={crumb.href} className="hover:underline" style={{ color: "var(--sf-accent)" }}>
              {crumb.label}
            </Link>
          ) : (
            <span style={{ color: "var(--text-1)", fontWeight: 600 }}>{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
