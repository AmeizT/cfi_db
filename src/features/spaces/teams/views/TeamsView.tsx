"use client"

import View from "@/components/ui/view"
import { EmptyState } from "@/components/ui/empty-state";

export function TeamsView() {
    return (
        <View className="gap-0">
            <View.Header
                pagename="Teams"
            />

            <View.Body className="py-4">
                <EmptyState type="teams" />
            </View.Body>
        </View>
    )
}
