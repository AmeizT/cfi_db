"use client"

import { Text } from "@/components/ui/text"
import { Spinner } from "@/components/ui/spinner"

export default function LoadingContent() {
    return (
        <div className="w-full h-full flex justify-center items-center gap-x-3 dark:bg-neutral-900">
            <Spinner className="bg-zinc-400 dark:bg-white" />

            <Text variant="shine">
                Loading...
            </Text>
        </div>
    )
}
