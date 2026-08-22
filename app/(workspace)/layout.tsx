import React from "react"

import { AuthenticatedAppLayout } from "@/layouts/AuthenticatedAppLayout"

export default function WorkspaceRootLayout({
    children,
}: {
    children: Readonly<React.ReactNode>
}) {
    return <AuthenticatedAppLayout>{children}</AuthenticatedAppLayout>
}
