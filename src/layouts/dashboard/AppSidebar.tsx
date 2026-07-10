"use client"

import React from "react"
import { motion } from "motion/react"
import { usePathname, useSearchParams } from "next/navigation"

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
} from "@/components/ui/sidebar"
import { useUser } from "@/hooks/query/use-user"
import { useReports } from "@/features/reports/core/hooks/use-reports"

import { NavRail } from "./NavRail"
import { NavForms } from "./NavForms"
import { NavReportWizard } from "./NavReportWizard"
import { NavSettings } from "./NavSettings"
import { SidebarNavigation } from "./SidebarNavigation"
import { Teamspaces } from "./Teamspaces"

import { getNavigation } from "../navigation/config/get-navigation"
import { parsePeriod } from "../navigation/helpers/parse-period"
import { getCurrentYear } from "../utils/get-current-year"

const ACTIVE_SIDEBAR_GROUPS = [
    "app",
    "assemblies",
    "administration",
    "forms",
    "reports",
    "report-wizard",
    "settings",
] as const

type ActiveSidebarGroup = (typeof ACTIVE_SIDEBAR_GROUPS)[number]

const SIDEBAR_LABELS: Record<ActiveSidebarGroup, string> = {
    app: "Home",
    assemblies: "Teamspaces",
    administration: "Administration",
    forms: "Forms",
    reports: "Reporting",
    "report-wizard": "Report Wizard",
    settings: "Settings",
}

function isActiveSidebarGroup(
    value: string | undefined
): value is ActiveSidebarGroup {
    return ACTIVE_SIDEBAR_GROUPS.includes(
        value as ActiveSidebarGroup
    )
}

interface RenderNavigationProps {
    activeGroup: ActiveSidebarGroup
    isRegionStaff: boolean
    navigation: ReturnType<typeof getNavigation>
    reportsData?: unknown
}

function RenderNavigation({
    activeGroup,
    navigation,
    isRegionStaff,
    reportsData,
}: RenderNavigationProps) {
    const renderers: Record<
        ActiveSidebarGroup,
        () => React.ReactNode
    > = {
        app: () => (
            <SidebarNavigation menu={navigation.dashboard} />
        ),

        assemblies: () => <Teamspaces />,

        administration: () => (
            <SidebarNavigation
                menu={
                    isRegionStaff
                        ? navigation.region
                        : navigation.dashboard
                }
            />
        ),

        forms: () => (
            <NavForms navigation={navigation.forms} />
        ),

        reports: () => (
            <SidebarNavigation
                menu={
                    isRegionStaff
                        ? navigation.region
                        : navigation.reports
                }
            />
        ),

        "report-wizard": () => (
            <NavReportWizard
                menu={navigation.reportWizard}
                reportsData={reportsData}
            />
        ),

        settings: () => (
            <NavSettings menu={navigation.settings} />
        ),
    }

    return renderers[activeGroup]()
}

export function AppSidebar({
    ...props
}: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const { data: user } = useUser()

    const period = parsePeriod(searchParams.get("period") ?? "")
    const year = String(
        period?.type === "year"
            ? period.value
            : getCurrentYear()
    )

    const { data: reports } = useReports({
        year,
        pageSize: 50,
    })

    const activeRegionId = user?.active_region?.id
    const reportId = reports?.data
        ?.at(-1)
        ?.id
        ?.toString() ?? ""

    const navigation = getNavigation({
        searchParams,
        user: {
            is_db_zone_staff: user?.is_db_zone_staff,
            is_region_staff: user?.is_region_staff,
        },
        reportId,
        regionId: activeRegionId
            ? String(activeRegionId)
            : "",
    })

    const segments = pathname.split("/").filter(Boolean)
    const rootSegment = segments[0]

    const derivedGroup: ActiveSidebarGroup =
        rootSegment === "regional-staff"
            ? "reports"
            : isActiveSidebarGroup(rootSegment)
                ? rootSegment
                : "app"

    const [assemblyPanelOpen, setAssemblyPanelOpen] =
        React.useState(false)

    const activeSidebarGroup: ActiveSidebarGroup =
        assemblyPanelOpen
            ? "assemblies"
            : derivedGroup

    function handleAssembliesClick() {
        setAssemblyPanelOpen(current => !current)
    }

    return (
        <Sidebar
            variant="inset"
            {...props}
            className="p-0 py-1.5 pr-1.5"
        >
            <div className="flex h-full w-full">
                <NavRail
                    menu={navigation.rail}
                    handleAssembliesClick={
                        handleAssembliesClick
                    }
                />

                <div className="grow rounded-2xl border-[0.5px] border-white bg-olive-100 shadow-xl">
                    <SidebarHeader className="flex h-fit flex-row items-center justify-between gap-0 px-2">
                        <div className="grow p-1">
                            <h4 className="pl-2 text-xl font-bold tracking-tighter">
                                {
                                    SIDEBAR_LABELS[
                                        activeSidebarGroup
                                    ]
                                }
                            </h4>
                        </div>
                    </SidebarHeader>

                    <SidebarContent className="flex-col items-center gap-1 px-2">
                        <motion.div
                            key={activeSidebarGroup}
                            initial={{
                                x: -20,
                                opacity: 0,
                            }}
                            animate={{
                                x: 0,
                                opacity: 1,
                            }}
                            exit={{
                                x: 20,
                                opacity: 0,
                            }}
                            transition={{
                                duration: 0.3,
                                ease: "easeInOut",
                            }}
                            className="w-full"
                        >
                            <RenderNavigation
                                activeGroup={
                                    activeSidebarGroup
                                }
                                isRegionStaff={Boolean(
                                    user?.is_region_staff
                                )}
                                navigation={navigation}
                                reportsData={reports}
                            />
                        </motion.div>
                    </SidebarContent>
                </div>
            </div>
        </Sidebar>
    )
}