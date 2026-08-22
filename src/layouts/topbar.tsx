"use client";

import Link from "next/link";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationsDrawer } from "@/layouts/notifications-drawer";
import { QuickCreate } from "@/layouts/quick-create";
import { AppSearch } from "./AppSearch";
import { ProfileDropdown } from "./dashboard/ProfileDropdown";

export function Topbar() {
  return (
    <header className="z-30 flex lg:hidden h-(--navbar-height) w-full shrink-0 justify-between items-center border-b border-border-subtle bg-background/80 backdrop-blur-2xl px-2 text-(--shell-chrome-foreground) sm:px-3">
      <div className="flex min-w-0 items-center gap-1.5">
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

      <AppSearch />

      <div className="flex shrink-0 items-center gap-0.5">
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
