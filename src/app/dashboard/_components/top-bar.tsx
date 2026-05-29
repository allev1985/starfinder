"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

function NavItem({
  label,
  href,
  createHref,
}: {
  label: string;
  href: string;
  createHref: string;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center">
      <Link
        href={href}
        className="px-3 py-2 text-sm font-medium hover:text-foreground/80"
      >
        {label}
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger className="px-1 py-2 hover:text-foreground/80">
          <ChevronDown className="h-4 w-4" />
          <span className="sr-only">Open {label} menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => router.push(createHref)}>
            Create new
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default function TopBar() {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="flex h-14 items-center px-4">
        <Link
          href="/dashboard"
          className="mr-6 text-sm font-semibold hover:text-foreground/80"
        >
          Starfinder
        </Link>
        <nav className="flex flex-1 items-center gap-1">
          <NavItem
            label="Campaigns"
            href="/dashboard/campaigns"
            createHref="/dashboard/campaigns/new"
          />
          <NavItem
            label="Characters"
            href="/dashboard/characters"
            createHref="/dashboard/characters/new"
          />
        </nav>
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    </header>
  );
}
