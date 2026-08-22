"use client"

import { usePathname, useSearchParams } from "next/navigation"
import View from "@/components/ui/view"
import { getPageTabs } from "@/layouts/navigation/config/get-page-tabs"
import { EmptyState } from "@/components/ui/empty-state";

export function ExceptionView({ embedded = false }: { embedded?: boolean }) {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    return (
        <View className="gap-0">
            {!embedded ? (
                <>
                    <View.Header pagename="Exceptions" />
                    <View.Tabs
                        items={getPageTabs("reports", { searchParams })}
                        pathname={pathname}
                    />
                </>
            ) : null}
            <View.Body className="h-full items-center justify-center">
                <EmptyState type="exceptions" />
            </View.Body>
        </View>
    )
}
