import { NavItem } from "../types"
import { getPath } from "@/utils/get-path"
import { BookOpen02Icon, FolderDownloadIcon, Layers02Icon, UserMultiple02Icon, UserSwitchIcon, Wallet03Icon } from "@hugeicons/core-free-icons"

export function dashboard(): NavItem[] {
    return [
        {
            label: "Finance",
            icon: Wallet03Icon,
            activeIcon: Wallet03Icon,
            href: `/app/finance`,
            mobile: true,
            get children() {

                return [
                    {
                        label: "Overview",
                        description: "Finance",
                        get href() {
                            return getPath(this.label, this.basePath);
                        },
                        basePath: this.href
                    },
                    {
                        label: "Assets",
                        description: "Church Assets",
                        get href() {
                            return getPath(this.label, this.basePath);
                        },
                        basePath: this.href
                    },
                ]
            }
        },
        {
            label: "Members",
            href: "/app/members",
            defaultHref: "/app/members/directory",
            icon: UserMultiple02Icon,
            activeIcon: UserMultiple02Icon,
            mobile: true,
            get children() {
                return [
                    {
                        label: "Directory",
                        description: "Members directory",
                        get href() {
                            return getPath(this.label, this.basePath);
                        },
                        basePath: this.href
                    },
                    {
                        label: "Households",
                        description: "Household directory",
                        get href() {
                            return getPath(this.label, this.basePath);
                        },
                        basePath: this.href
                    },
                    {
                        label: "Onboarding",
                        description: "New member onboarding",
                        get href() {
                            return getPath(this.label, this.basePath);
                        },
                        basePath: this.href
                    },
                    {

                        label: "Baptisms",
                        description: "Baptism records",
                        get href() {
                            return getPath(this.label, this.basePath);
                        },
                        basePath: this.href
                    },
                    {
                        label: "Former Members",
                        description: "Former members",
                        get href() {
                            return getPath(this.label, this.basePath);
                        },
                        basePath: this.href
                    },
                    {
                        label: "Transfers",
                        description: "Member transfers",
                        icon: UserSwitchIcon,
                        activeIcon: UserSwitchIcon,
                        get href() {
                            return getPath(this.label, this.basePath);
                        },
                        basePath: this.href
                    },
                ]
            },
        },
        {
            label: "Spaces",
            href: "/app/spaces",
            icon: Layers02Icon,
            activeIcon: Layers02Icon,
            mobile: true,
            get children() {
                return [
                    {
                        label: "Overview",
                        description: "Groups summary",
                        get href() {
                            return getPath(this.label, this.basePath);
                        },
                        basePath: this.href
                    },
                    {
                        label: "Home Cells",
                        description: "Home Cells",
                        href: "/app/spaces/home-cells",
                    },
                    {
                        label: "Ministry Teams",
                        description: "Ministry teams",
                        get href() {
                            return getPath(this.label, this.basePath);
                        },
                        basePath: this.href
                    },
                    {
                        label: "Meetings",
                        description: "Group resources and materials",
                        get href() {
                            return getPath(this.label, this.basePath);
                        },
                        basePath: this.href
                    },
                ]
            },
        },
        {
            label: "Library",
            href: "/app/library",
            icon: FolderDownloadIcon,
            activeIcon: FolderDownloadIcon,
            mobile: true,
            get children() {
                return [
                    {
                        label: "Overview",
                        description: "Members Summary",
                        get href() {
                            return getPath(this.label, this.basePath);
                        },
                        basePath: this.href
                    },
                ]
            },
        },
    ]
}
