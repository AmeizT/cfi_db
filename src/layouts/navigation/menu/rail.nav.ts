import { getCurrentYear } from "@/layouts/utils/get-current-year";
import { RailNavigation } from "../types"
import { Add01Icon, Briefcase08Icon, ChartRoseIcon, DashboardCircleIcon, FileEditIcon, Home02Icon, Home13Icon, Notification01Icon, Settings01Icon, UserMultiple02Icon } from "@hugeicons/core-free-icons"
import { createQueryString } from "@/features/reports/core/lib/create-query-string";
import { ReadonlyURLSearchParams } from "next/navigation";
import { buildPeriod } from "../helpers/build-period";
import { BellRingIcon } from '@solar-icons/react/bold-duotone/bell-ring'
import { NotesMinimalisticIcon } from '@solar-icons/react/bold-duotone/notes-minimalistic'
import { Widget6Icon as DashboardIcon } from '@solar-icons/react/bold-duotone/widget-6'
import { AddCircleIcon } from '@solar-icons/react/bold-duotone/add-circle'
import { NotesIcon } from "@solar-icons/react/bold-duotone";

interface Props {
    searchParams: ReadonlyURLSearchParams
    regionId: string
    user?: {
        is_db_zone_staff?: boolean
        is_region_staff?: boolean
    } 
}

export function navRail({ user, searchParams, regionId }: Props): RailNavigation {
    const defaultYear = getCurrentYear()
    
    const params = createQueryString(searchParams ?? null, {
        period: buildPeriod({
            type: "year",
            value: Number(defaultYear),
        }),

    })

    const reportUrl = user?.is_region_staff ? `/regional-staff/region/${regionId}` : `/reports/activity?${params}`
    
    const topItems: RailNavigation["top"] = []

    if (!user?.is_region_staff) {
        topItems.push({
            label: "Dashboard",
            icon: DashboardIcon,
            activeIcon: DashboardIcon,
            mobile: true,
            href: `/app/dashboard`,
        })
    }

    topItems.push({
        label: "Reporting",
        icon: NotesMinimalisticIcon,
        activeIcon: NotesMinimalisticIcon,
        mobile: true,
        href: reportUrl
    })

    // topItems.push({
    //     label: "Report Wizard",
    //     icon: FileEditIcon,
    //     activeIcon: FileEditIcon,
    //     mobile: true,
    //     href: "/report-wizard",
    // })

    topItems.push({
        label: "Notifications",
        icon: BellRingIcon,
        activeIcon: BellRingIcon,
        mobile: true,
        href: `#`,
    })

    topItems.push({
        label: "Report Wizard",
        icon: AddCircleIcon,
        activeIcon: AddCircleIcon,
        mobile: true,
        href: "/report-wizard",
    })

    const formsIndex = topItems.findIndex(item => item.label === "Forms")

    if (user?.is_db_zone_staff) {
        topItems.splice(formsIndex, 0, {
            label: "Zone",
            icon: Briefcase08Icon,
            activeIcon: Briefcase08Icon,
            mobile: true,
            href: `/zone`,
        })
    }

    if (user?.is_region_staff) {
        topItems.splice(formsIndex, 0, {
            label: "Administration",
            icon: UserMultiple02Icon,
            activeIcon: UserMultiple02Icon,
            mobile: true,
            href: "/administration/assemblies",
        })
    }
    
    const bottomItems = [
        {
            label: "Settings",
            icon: Settings01Icon,
            activeIcon: Settings01Icon,
            mobile: true,
            href: `/settings/account`,
        },
    ]

    return { top: topItems, bottom: bottomItems }
}
