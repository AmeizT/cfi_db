import { getCurrentYear } from "@/layouts/utils/get-current-year";
import { RailNavigation } from "../types"
import { Add01Icon, Briefcase08Icon, ChartRoseIcon, FileEditIcon, Home02Icon, Home13Icon, Settings01Icon, UserMultiple02Icon } from "@hugeicons/core-free-icons"
import { createQueryString } from "@/features/reports/core/lib/create-query-string";
import { ReadonlyURLSearchParams } from "next/navigation";
import { buildPeriod } from "../helpers/build-period";

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

    const reportUrl = user?.is_region_staff ? `http://localhost:3000/regional-staff/region/${regionId}` : `/reports/review-queue?${params}`
    
    const topItems: RailNavigation["top"] = []

    if (!user?.is_region_staff) {
        topItems.push({
            label: "Dashboard",
            icon: Home02Icon,
            activeIcon: Home02Icon,
            mobile: true,
            href: `/app/dashboard`,
        })
    }

    topItems.push({
        label: "Reporting",
        icon: ChartRoseIcon,
        activeIcon: ChartRoseIcon,
        mobile: true,
        href: reportUrl
    })

    topItems.push({
        label: "Report Wizard",
        icon: FileEditIcon,
        activeIcon: FileEditIcon,
        mobile: true,
        href: "/report-wizard",
    })

    topItems.push({
        label: "Forms",
        icon: Add01Icon,
        activeIcon: Add01Icon,
        mobile: true,
        href: `#`,
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
