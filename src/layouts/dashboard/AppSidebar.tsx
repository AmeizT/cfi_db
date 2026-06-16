"use client"

import React from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { 
    Sidebar, 
    SidebarContent,  
    SidebarHeader,
} from "@/components/ui/sidebar"
import { NavRail } from "./NavRail"
import { NavForms } from "./NavForms"
import { NavReports } from "./NavReports"
import { Teamspaces } from "./Teamspaces"
import { NavDashboard } from "./NavDashboard"
import { getNavigation } from "../navigation/config/get-navigation"
import { motion } from "motion/react"
import { NavSettings } from "./NavSettings"
import { useUser } from "@/hooks/query/use-user"
import { useReports } from "@/features/reports/core/hooks/use-reports"
import { parsePeriod } from "../navigation/helpers/parse-period"
import { getCurrentYear } from "../utils/get-current-year"

interface RenderNavigationProps {
    activeGroup: string
    activeUrl: string
    navigation: ReturnType<typeof getNavigation>
}

function RenderNavigation({ activeGroup, navigation}: RenderNavigationProps) {
    switch (activeGroup) {
        case "app":
            return <NavDashboard menu={navigation.dashboard} />
        case "assemblies":
            return <Teamspaces />
        case "forms":
            return <NavForms navigation={navigation.forms} />
        case "reports":
            return <NavReports menu={navigation.reports} />
        case "settings":
            return <NavSettings menu={navigation.settings} />
        
        default:
            return <NavDashboard menu={navigation.dashboard} />
    }
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const period = parsePeriod(searchParams.get("period") || "")
    const year = String(period?.type === "year" ? period.value : getCurrentYear())
    const { data: user } = useUser()
    const { data: reports } = useReports({ year: year || "" })
    const zoneStaff = { is_db_zone_staff: user?.is_db_zone_staff }
    const reportId = year ? reports?.data?.at(-1)?.id?.toString() : ""
    
    const navigation = getNavigation(searchParams, reportId)

    const segments = pathname.split("/").filter(Boolean)
    const derivedGroup = segments[0] ?? "app"
    
    const activeUrl = segments[1] ?? ""

    const [assemblyPanelOpen, setAssemblyPanelOpen] = React.useState(false)

    const activeSidebarGroup = assemblyPanelOpen
        ? "assemblies"
        : derivedGroup

    function handleAssembliesClick() {
        setAssemblyPanelOpen(prev => !prev)
    }

    const sidebarLabel: Record<string, string> = {
        app: "Home",
        assemblies: "Teamspaces",
        reports: "Reporting",
        settings: "Settings"
    }

    return (
        <Sidebar variant="sidebar" {...props}>
            <div className="w-full h-full flex">
                <NavRail menu={navigation.rail} handleAssembliesClick={handleAssembliesClick} />

                <div className="grow rounded-none bg-linear-to-b from-white via-white to-white dark:to-background border-none border-border">
                    <SidebarHeader className="px-2 gap-0 h-fit flex flex-row justify-between items-center">
                        <div className="grow p-1">
                            <h4 className="pl-2 capitalize text-xl tracking-tighter font-bold">
                                {sidebarLabel[activeSidebarGroup] || activeSidebarGroup}
                            </h4>

                            {/* <button className="size-7 center rounded-[0.5625rem] text-mist-500 bg-mist-50 border border-mist-300/70 hover:text-mist-600 hover:border-mist-300 shadow-xs transition-all duration-150 ease-out">
                            <IconPlus strokeWidth={2} className="size-4" />
                        </button> */}
                        </div>
                    </SidebarHeader>

                    <SidebarContent className="px-2 flex-col items-center gap-1">
                        <motion.div
                            key={activeSidebarGroup}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 20, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="w-full"
                        >
                            <RenderNavigation 
                                activeUrl={activeUrl} 
                                activeGroup={activeSidebarGroup} 
                                navigation={navigation} 
                            />
                        </motion.div>
                    </SidebarContent>
                </div>
            </div>
        </Sidebar>
    )
}
