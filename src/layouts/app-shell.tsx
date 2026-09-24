"use client"

import * as React from "react"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { workspaceThemeColor } from "@/features/regional-shell/scope"
import { applyChurchTheme } from "@/features/appearance/lib/apply-church-theme"
import { useShellColorMode } from "@/features/appearance/hooks/use-shell-color-mode"
import { JethroLauncher } from "@/features/jethro/components/JethroLauncher"
import { RecentVisitsTracker } from "@/features/dashboard/lib/recent-visits"
import { useUser } from "@/hooks/query/use-user"
import { ContextSidebar } from "@/layouts/ContextSidebar"
import { NewLauncherProvider } from "@/features/create/launcher/NewLauncher"
import { Topbar } from "@/layouts/topbar"

export function AppShell({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  const { data: user } = useUser();

  const assemblyColor = workspaceThemeColor(user);
  useShellColorMode();

  React.useLayoutEffect(() => {
    applyChurchTheme(assemblyColor);
  }, [assemblyColor]);

  return (
    <div className="flex min-h-dvh w-full flex-col bg-sidebar text-foreground [--navbar-height:3.5rem] md:h-dvh md:overflow-hidden md:[--navbar-height:3rem]">
      <SidebarProvider className="bg-sidebar dark:bg-sidebar min-h-dvh flex-1 flex-col overflow-visible md:min-h-0 md:overflow-hidden">
        <NewLauncherProvider>
        <RecentVisitsTracker />

        <div className="flex min-h-0 flex-1 overflow-visible md:overflow-hidden">
          <ContextSidebar />

          <SidebarInset className="min-h-0 min-w-0 flex-col overflow-visible bg-white dark:bg-neutral-900 md:my-2 md:mr-2 md:ml-2 md:overflow-hidden md:rounded-[20px] md:ring-1 md:ring-sidebar-border md:shadow-none">
            <Topbar />

            <div className="@container/main flex min-h-0 flex-1 flex-col overflow-visible overscroll-auto pb-[env(safe-area-inset-bottom)] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-300 md:overflow-y-auto md:overscroll-contain">
              {children}
            </div>
          </SidebarInset>
        </div>

        <JethroLauncher />
        </NewLauncherProvider>
      </SidebarProvider>
    </div>
  );
}

export default AppShell;
