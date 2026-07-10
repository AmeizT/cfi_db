"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type RegionalDirectoryErrorProps = {
    error: unknown
}

function getErrorMessage(error: unknown) {
    if (error instanceof Error) {
        return error.message
    }

    return "The regional directory could not be loaded."
}

export function RegionalDirectoryError({ error }: RegionalDirectoryErrorProps) {
    return (
        <Alert variant="destructive">
            <AlertTitle>Unable to load data</AlertTitle>
            <AlertDescription>{getErrorMessage(error)}</AlertDescription>
        </Alert>
    )
}
