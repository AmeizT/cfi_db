"use client"

import View from "@/components/ui/view"
import { EmptyState } from "@/components/ui/empty-state"

export function HouseholdsView() {
    return (
        <View className="gap-0">
            <View.Header
                pagename="Households"
            />

            <View.Body className="py-4">
                <EmptyState type="onboarding" />
            </View.Body>
        </View>
    )
}
