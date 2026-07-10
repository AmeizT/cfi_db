"use client"

import { Text } from "@/components/ui/text"
import { Spinner } from "@/components/ui/spinner"

export default function LoadingContent() {
    return (
        <div className="w-full h-full flex justify-center items-center gap-x-3 bg-background">
            <Spinner className="bg-muted-foreground" />

            <Text variant="shine">
                Loading...
            </Text>
        </div>
    )
}
