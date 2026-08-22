"use client";

import * as React from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { applyChurchTheme } from "@/features/appearance/lib/apply-church-theme";
import { useShellColorMode } from "@/features/appearance/hooks/use-shell-color-mode";
import { JethroLauncher } from "@/features/jethro/components/JethroLauncher";
import { RecentVisitsTracker } from "@/features/dashboard/lib/recent-visits";
import { useUser } from "@/hooks/query/use-user";
import { ContextSidebar } from "@/layouts/ContextSidebar";
import { Topbar } from "@/layouts/topbar";

export function AppShell({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  const { data: user } = useUser();

  useShellColorMode();

  React.useEffect(() => {
    applyChurchTheme(user?.assembly?.avatar_fallback);
  }, [user?.assembly?.avatar_fallback]);

  return (
    <div className="flex min-h-dvh w-full flex-col overflow-hidden bg-zinc-50 text-foreground dark:bg-zinc-950 [--navbar-height:3.5rem] md:h-dvh md:[--navbar-height:3rem]">
      <SidebarProvider className="min-h-0 flex-1 flex-col overflow-hidden">
        <RecentVisitsTracker />

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <ContextSidebar />

          <SidebarInset className="min-h-0 min-w-0 flex-col overflow-hidden bg-background md:my-2 md:mr-2 md:rounded-2xl md:border md:border-border-subtle md:shadow-sm">
            <Topbar />

            <div className="@container/main flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom)] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-300">
              {children}
            </div>
          </SidebarInset>
        </div>

        <JethroLauncher />
      </SidebarProvider>
    </div>
  );
}

export default AppShell;
