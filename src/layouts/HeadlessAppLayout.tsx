import React from "react"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

import { getUser } from "@/features/auth/services/get-user"
import { getLayoutComponent } from "@/layouts/registry"
import { AuthenticatedWorkspaceProviders } from "@/layouts/providers/authenticated-workspace"
import { makeQueryClient, seedCurrentUser } from "@/layouts/providers/query-client"
import ReactQueryProvider from "@/layouts/providers/query"

const Document = getLayoutComponent("root")
const HeadlessLayout = getLayoutComponent("headless")

export function HeadlessAppLayout({
    children,
}: {
    children: Readonly<React.ReactNode>
}) {
    const user = React.use(getUser())
    const queryClient = makeQueryClient()
    seedCurrentUser(queryClient, user)

    return (
        <Document isAuthenticated={Boolean(user)} user={user}>
            <ReactQueryProvider>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <AuthenticatedWorkspaceProviders>
                        <React.Suspense>
                            <HeadlessLayout>
                                {children}
                            </HeadlessLayout>
                        </React.Suspense>
                    </AuthenticatedWorkspaceProviders>
                </HydrationBoundary>
            </ReactQueryProvider>
        </Document>
    )
}
