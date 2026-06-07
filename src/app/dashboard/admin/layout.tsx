import { redirect } from "next/navigation";
import { getUser, isAdmin } from "@/lib/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (!isAdmin(user)) redirect("/dashboard");
  return <>{children}</>;
}
