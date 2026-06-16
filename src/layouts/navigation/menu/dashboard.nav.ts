import { NavItem } from "../types"
import { getPath } from "@/utils/get-path"
import { FolderDownloadIcon, Layers02Icon, UserMultiple02Icon, Wallet03Icon } from "@hugeicons/core-free-icons"

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
            label: "People",
            href: "/app/people",
            defaultHref: "/people/members",
            icon: UserMultiple02Icon,
            activeIcon: UserMultiple02Icon,
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
                    {
                        label: "Members",
                        description: "Members",
                        get href() {
                            return getPath(this.label, this.basePath);
                        },
                        basePath: this.href
                    },
                    {

                        label: "Newcomers",
                        description: "New members",
                        get href() {
                            return getPath(this.label, this.basePath);
                        },
                        basePath: this.href
                    },
                    {
                        label: "Baptism",
                        description: "Baptism",
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
                        label: "Homecells",
                        description: "Homecells",
                        get href() {
                            return getPath(this.label, this.basePath);
                        },
                        basePath: this.href
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