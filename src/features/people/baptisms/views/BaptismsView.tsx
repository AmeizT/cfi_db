"use client"

import View from "@/components/ui/view"
import { EmptyState } from "@/components/ui/empty-state";

export function BaptismsView() {
    return (
        <View className="gap-0">
            <View.Header
                pagename="Baptisms"
            />

            <View.Body className="py-4">
                <EmptyState type="baptisms" />
            </View.Body>
        </View>
    )
}
