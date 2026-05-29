import TopBar from "./_components/top-bar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopBar />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
