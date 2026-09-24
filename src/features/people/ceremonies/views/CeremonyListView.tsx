"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import View from "@/components/ui/view"
import { EmptyState } from "@/components/ui/empty-state"
import { useUser } from "@/hooks/query/use-user"

type CeremonyListViewProps = {
    title: "Baptisms" | "Baby Dedications"
    embedded?: boolean
    emptyType: "baptisms" | "babyDedications"
}

export function CeremonyListView({ title, emptyType, embedded }: CeremonyListViewProps) {
    const user = useUser()

    const content = (
        <div className="py-4">
                {user.isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading {title.toLowerCase()}…</p>
                ) : user.isError ? (
                    <p className="text-sm text-destructive">Unable to verify access to {title.toLowerCase()}.</p>
                ) : (
                    <EmptyState type={emptyType} />
                )}
        </div>
    )
    return embedded ? content : <View className="gap-0">
        <div className="flex justify-end px-6 pt-4">
            <Button size="sm" disabled title="Creation is not available yet.">
                <Plus className="size-4" aria-hidden="true" />
                {title === "Baptisms" ? "New Baptism" : "New Baby Dedication"}
            </Button>
        </div>
        <View.Body>
            <p className="text-sm text-muted-foreground">Creation is not available yet.</p>{content}</View.Body></View>
}
