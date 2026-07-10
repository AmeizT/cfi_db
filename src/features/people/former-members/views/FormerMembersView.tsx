"use client"

import View from "@/components/ui/view"
import { EmptyState } from "@/components/ui/empty-state";

export function FormerMembersView() {
    return (
        <View className="gap-0">
            <View.Header
                pagename="Former Members"
            />

            <View.Body className="py-4">
                <EmptyState type="formerMembers" />
            </View.Body>
        </View>
    )
}
