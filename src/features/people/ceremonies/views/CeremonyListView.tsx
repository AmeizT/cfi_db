"use client"

import View from "@/components/ui/view"
import { EmptyState } from "@/components/ui/empty-state"
import { useUser } from "@/hooks/query/use-user"

type CeremonyListViewProps = {
    title: "Baptisms" | "Baby Dedications"
    emptyType: "baptisms" | "babyDedications"
}

export function CeremonyListView({ title, emptyType }: CeremonyListViewProps) {
    const user = useUser()

    return (
        <View className="gap-0">
            <View.Header pagename={title} />
            <View.Body className="py-4">
                {user.isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading {title.toLowerCase()}…</p>
                ) : user.isError ? (
                    <p className="text-sm text-destructive">Unable to verify access to {title.toLowerCase()}.</p>
                ) : (
                    <EmptyState type={emptyType} />
                )}
            </View.Body>
        </View>
    )
}
