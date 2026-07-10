import { NavGroup, NavItem } from "../types"
import {
    Analytics03Icon,
    BookOpen02Icon,
    ChartBreakoutCircleIcon,
    CourtLawIcon,
    Crown03Icon,
    FirewallIcon,
    Layers02Icon,
    Leaf04Icon,
    Plant01Icon,
    UserMultiple02Icon,
    Wallet03Icon,
} from "@hugeicons/core-free-icons"

function withReportsTab(path: string) {
    return `${path}?tab=reports`
}

export function region(_searchParams: unknown, regionId: string): NavGroup[] {
    const basePath = `/regional-staff/region/${regionId}`
    const overview: NavItem = {
        label: "Overview",
        description: "Regional summary, KPIs, zone KPIs, and alerts",
        icon: Analytics03Icon,
        activeIcon: Analytics03Icon,
        href: basePath,
        exact: true,
    }
    const finance: NavItem = {
        label: "Finance",
        description: "Regional finance reports and health indicators",
        icon: Wallet03Icon,
        activeIcon: Wallet03Icon,
        href: withReportsTab(`${basePath}/finance`),
    }
    const compliance: NavItem = {
        label: "Compliance",
        description: "Report submission, completion, skip, and lateness compliance",
        icon: CourtLawIcon,
        activeIcon: CourtLawIcon,
        href: withReportsTab(`${basePath}/compliance`),
    }
    const risk: NavItem = {
        label: "Risk",
        description: "Regional reporting, finance, growth, ministry, and leadership risk",
        icon: FirewallIcon,
        activeIcon: FirewallIcon,
        href: withReportsTab(`${basePath}/risk`),
    }
    const growth: NavItem = {
        label: "Growth",
        description: "Membership, baptisms, new converts, and new church plants",
        icon: Leaf04Icon,
        activeIcon: Plant01Icon,
        href: withReportsTab(`${basePath}/growth`),
    }
    const ministry: NavItem = {
        label: "Ministry",
        description: "Outreach, homecells, ministry activity, and engagement",
        icon: BookOpen02Icon,
        activeIcon: BookOpen02Icon,
        href: withReportsTab(`${basePath}/ministry`),
    }
    const leadership: NavItem = {
        label: "Leadership",
        description: "Pastors, meetings, verification, and assets",
        icon: Crown03Icon,
        activeIcon: Crown03Icon,
        href: withReportsTab(`${basePath}/leadership`),
    }
    const assemblies: NavItem = {
        label: "Assemblies",
        description: "Churches and assemblies in your assigned region",
        icon: Layers02Icon,
        activeIcon: Layers02Icon,
        href: "/administration/assemblies",
        permissions: ["is_region_staff"],
    }
    const users: NavItem = {
        label: "Users",
        description: "Users registered through regional assemblies",
        icon: UserMultiple02Icon,
        activeIcon: UserMultiple02Icon,
        href: "/administration/users",
        permissions: ["is_region_staff"],
    }

    return [
        {
            id: "regional",
            label: "Region",
            items: [
                overview,
                finance,
                growth,
                ministry,
                leadership,
            ],
        },
        {
            id: "compliance",
            label: "Governance",
            items: [compliance, risk],
        },
        {
            id: "administration",
            label: "Administrative",
            items: [assemblies, users],
        },
    ]
}
