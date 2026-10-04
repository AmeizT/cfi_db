"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssemblySwitcher } from "./dashboard/AssemblySwitcher";
import { ZoneSwitcher } from "@/features/regional-shell/ZoneSwitcher";
import { applySidebarForeground } from "@/features/appearance/lib/sidebar-foreground";
import { DEFAULT_CHURCH_THEME } from "@/features/appearance/lib/apply-church-theme";
import { usesRegionalShell, workspaceThemeColor } from "@/features/regional-shell/scope";
import { useUser } from "@/hooks/query/use-user";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationsDrawer } from "@/layouts/notifications-drawer";
import { QuickCreate } from "@/layouts/quick-create";
import { AppSearch } from "./AppSearch";
import { ProfileDropdown } from "./dashboard/ProfileDropdown";

export function Topbar() {
  const { data: user } = useUser();
  return (
    <header className="z-30 flex lg:hidden h-(--mobile-navbar-height) pt-[env(safe-area-inset-top)] fixed inset-x-0 top-0 w-full shrink-0 justify-between items-center border-0 bg-white dark:bg-neutral-900 md:border-b md:border-border-subtle md:bg-background/80 md:dark:bg-background/80 md:backdrop-blur-2xl px-2 text-(--shell-chrome-foreground) sm:px-3">
      <div className="flex w-full min-w-0 items-center justify-between gap-3 md:hidden">
        <div className="min-w-0 flex-1">{usesRegionalShell(user) ? <ZoneSwitcher /> : <AssemblySwitcher variant="sidebar" />}</div>
        <div className="flex shrink-0 items-center gap-2">
          <AppSearch variant="mobile" />
          <QuickCreate mobile trigger={
            <Button variant="default" size="icon" aria-label="Create"
              ref={node => { if (node) applySidebarForeground(node, workspaceThemeColor(user) ?? DEFAULT_CHURCH_THEME) }}
              className="size-10 rounded-full border-0 bg-assembly-theme text-(--assembly-sidebar-active-foreground) shadow-sm hover:bg-assembly-theme hover:brightness-95">
              <Plus className="size-5" />
            </Button>
          } />
        </div>
      </div>
      <div className="hidden md:flex min-w-0 items-center gap-1.5">
        <SidebarTrigger
          aria-label="Toggle workspace navigation"
          className="size-10 text-(--shell-chrome-foreground) hover:bg-(--shell-chrome-hover) hover:text-(--shell-chrome-foreground)"
        />

        <Link
          href="/"
          aria-label="CFI Workspace home"
          className="_flex hidden shrink-0 items-center rounded-lg px-1.5 py-1 font-bold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-(--shell-focus-ring)"
        >
          <span>CFI</span>
          <span className="ml-1 hidden sm:inline">Workspace</span>
        </Link>
      </div>

      

      <div className="hidden md:flex shrink-0 items-center gap-2">
        <AppSearch />
        <div className="hidden sm:block">
          <QuickCreate />
        </div>
        <div className="hidden sm:block">
          <NotificationsDrawer />
        </div>
        <ProfileDropdown />
      </div>
    </header>
  )
}
