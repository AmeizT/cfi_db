import { NavItem } from "../types"
import { CircleLock02Icon, ColorsIcon, DarkModeIcon, SecurityIcon, UserCircle02Icon } from "@hugeicons/core-free-icons"

export function settings(): NavItem[] {
    return [
        {
            label: "Account",
            href: `/settings/account`,
            icon: UserCircle02Icon,
            activeIcon: UserCircle02Icon,
            children: []
        },
        {
            label: "Security",
            href: `/settings/security`,
            icon: SecurityIcon,
            activeIcon: SecurityIcon,
            children: []
        },
        {
            label: "Appearance",
            href: `/settings/appearance`,
            icon: DarkModeIcon,
            activeIcon: DarkModeIcon,
            children: []
        }
    ]
}