"use client"

import type { ReactNode } from "react"
import { QueryClientProvider } from "@tanstack/react-query"

import { makeQueryClient } from "./query-client"

let browserQueryClient: ReturnType<typeof makeQueryClient> | undefined

function getQueryClient() {
    if (typeof window === "undefined") return makeQueryClient()
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
}

export default function ReactQueryProvider({ children }: { children: ReactNode }) {
    const queryClient = getQueryClient()

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
