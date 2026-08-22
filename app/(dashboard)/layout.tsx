import React from "react"
import { AuthenticatedAppLayout } from "@/layouts/AuthenticatedAppLayout"

interface ChildrenProps {
    children: Readonly<React.ReactNode>
}

export default function DashboardRootLayout({ children }: ChildrenProps) {
    return <AuthenticatedAppLayout>{children}</AuthenticatedAppLayout>
}
