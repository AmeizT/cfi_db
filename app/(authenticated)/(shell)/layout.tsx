import { Suspense, type ReactNode } from "react"

import { AppShell } from "@/layouts/app-shell"

export default function PersistentShellLayout({ children }: { children: ReactNode }) {
    return (
        <AppShell>
            <Suspense>{children}</Suspense>
        </AppShell>
    )
}
