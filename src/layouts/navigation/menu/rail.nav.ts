import { getCurrentYear } from "@/layouts/utils/get-current-year";
import { RailNavigation } from "../types"
import { Add01Icon, Briefcase08Icon, ChartRoseIcon, Home13Icon, Settings01Icon } from "@hugeicons/core-free-icons"
import { createQueryString } from "@/features/reports/core/lib/create-query-string";
import { ReadonlyURLSearchParams } from "next/navigation";
import { buildPeriod } from "../helpers/build-period";

interface Props {
    user?: { is_db_zone_staff?: boolean } 
    searchParams: ReadonlyURLSearchParams
}

export function navRail({ user, searchParams }: Props): RailNavigation {
    const defaultYear = getCurrentYear()

    const params = createQueryString(searchParams ?? null, {
        period: buildPeriod({
            type: "year",
            value: Number(defaultYear),
        }),

    })
    
    const topItems = [
        {
            label: "Dashboard",
            icon: Home13Icon,
            activeIcon: Home13Icon,
            mobile: true,
            href: `/app/dashboard`,
        },
        {
            label: "Reporting",
            icon: ChartRoseIcon,
            activeIcon: ChartRoseIcon,
            mobile: true,
            get href() {
                return `/reports/review-queue?${params}`
            },
        },
        {
            label: "Forms",
            icon: Add01Icon,
            activeIcon: Add01Icon,
            mobile: true,
            href: `/forms`,
        },
        // {
        //     label: "Imports",
        //     icon: UploadCircle01Icon,
        //     activeIcon: UploadCircle01Icon,
        //     mobile: true,
        //     href: `/imports?tab=attendance`,
        // },
    ]

    if (user?.is_db_zone_staff) {
        topItems.push({
            label: "Zone",
            icon: Briefcase08Icon,
            activeIcon: Briefcase08Icon,
            mobile: true,
            href: `/zone`,
        })
    }

    const bottomItems = [
        // {
        //     label: "Trash",
        //     icon: Delete02Icon,
        //     activeIcon: Delete02Icon,
        //     mobile: true,
        //     href: `/trash`,
        // },
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