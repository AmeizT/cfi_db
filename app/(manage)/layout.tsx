import { getLayoutComponent } from "@/layouts/registry"
import { getUser } from "@/features/auth/services/get-user"
import React from "react"
import ReactQueryProvider from "@/layouts/providers/query"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

interface ChildrenProps {
    children: Readonly<React.ReactNode>
}

const Document = getLayoutComponent("root")
const Layout = getLayoutComponent("headlessSidebar")

export default function DashboardRootLayout({ children }: ChildrenProps) {
    const user = React.use(getUser())
    const queryClient = new QueryClient()
    const isAuthenticated = Boolean(user)
    
    return (
        <Document isAuthenticated={isAuthenticated} user={user}>
            <ReactQueryProvider>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <React.Suspense>
                        <Layout>{children}</Layout>
                    </React.Suspense>
                </HydrationBoundary>
            </ReactQueryProvider>
        </Document>
    )
}