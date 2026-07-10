"use client"

import { usePathname, useSearchParams } from "next/navigation"
import View from "@/components/ui/view"
import { getPageTabs } from "@/layouts/navigation/config/get-page-tabs"
import { MissingFilesIcon } from "@/components/icons/MissingFiles";
import { EmptyState } from "@/components/ui/empty-state";

export function ExceptionView() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    return (
        <View className="gap-0">
            <View.Header 
                pathname={pathname}
                pagename="Exceptions" 
                tabs={getPageTabs("reports", { searchParams })}
            />
            <View.Body className="h-full items-center justify-center">
                <EmptyState type="exceptions" />
            </View.Body>
        </View>
    )
}
