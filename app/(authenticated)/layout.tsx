import type { ReactNode } from "react"

import { AuthenticatedAppLayout } from "@/layouts/AuthenticatedAppLayout"

export default function AuthenticatedRootLayout({ children }: { children: ReactNode }) {
    return <AuthenticatedAppLayout>{children}</AuthenticatedAppLayout>
}
