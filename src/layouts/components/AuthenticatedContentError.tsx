"use client"

import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"

export function AuthenticatedContentError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error("Authenticated content failed", {
            digest: error.digest,
            name: error.name,
        })
    }, [error])

    return (
        <EmptyState
            type="reports"
            title="Something went wrong"
            description="This page could not be loaded. Your workspace session is still active."
            action={<Button type="button" variant="outline" onClick={reset}>Try again</Button>}
        />
    )
}
