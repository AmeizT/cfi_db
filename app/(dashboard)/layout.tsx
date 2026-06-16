import React from "react"
import { getLayoutComponent } from "@/layouts/registry"
import { getUser } from "@/features/auth/services/get-user"
import ReactQueryProvider from "@/layouts/providers/query"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

interface ChildrenProps {
    children: Readonly<React.ReactNode>
}

const Document = getLayoutComponent("root")
const DashboardLayout = getLayoutComponent("dashboard")

export default function DashboardRootLayout({ children }: ChildrenProps) {
    const user = React.use(getUser())
    const queryClient = new QueryClient()
    const isAuthenticated = Boolean(user)

    return (
        <Document isAuthenticated={isAuthenticated} user={user}>
            <ReactQueryProvider>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <React.Suspense>
                        <DashboardLayout>{children}</DashboardLayout>
                    </React.Suspense>
                </HydrationBoundary>
            </ReactQueryProvider>
        </Document>
    )
}