"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"

import View from "@/components/ui/view"
import { APP_ROUTES } from "@/config/app-routes"
import { MembersSectionNavigation } from "./MembersSectionNavigation"

function activePageName(pathname: string) {
    if (pathname.startsWith(APP_ROUTES.members.households)) return "Households"
    if (pathname.startsWith(APP_ROUTES.members.baptisms)) return "Baptisms"
    if (pathname.startsWith(APP_ROUTES.members.dedications)) return "Dedications"
    if (pathname.startsWith(APP_ROUTES.members.transfers)) return "Transfers"
    if (pathname.startsWith(APP_ROUTES.members.onboarding)) return "Onboarding"
    if (pathname.startsWith(APP_ROUTES.members.lifecycle)) return "Onboarding"
    return "Directory"
}

export function MembersWorkspace({ children }: { children: ReactNode }) {
    const pathname = usePathname()

    return (
        <View className="mb-0 min-h-0 overflow-hidden">
            <View.Header
                pagename={activePageName(pathname)}
                headingAs="h1"
                className="px-4 lg:px-0"
            />
            <MembersSectionNavigation />

            <View.Body className="min-h-0 flex-1 gap-0 overflow-hidden p-0 pb-0">
                <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
            </View.Body>
        </View>
    )
}
