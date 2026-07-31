import { PersonCurlyHairIcon, PlacardIcon, PurseIcon } from "@/assets/icons";
import { NavItem } from "../types"
import { getPath } from "@/utils/get-path"
import { FolderDownloadIcon, Layers02Icon, UserMultiple02Icon, UserSwitchIcon, Wallet03Icon } from "@hugeicons/core-free-icons"
import { WalletIcon } from '@solar-icons/react/bold-duotone/wallet'
import { CardIcon } from '@solar-icons/react/bold-duotone/card'
import { BoxIcon } from '@solar-icons/react/bold-duotone/box'
import { ThreeSquaresIcon } from '@solar-icons/react/bold-duotone/three-squares'
import { UsersGroupRoundedIcon } from '@solar-icons/react/bold-duotone/users-group-rounded'
import { LibraryIcon } from '@solar-icons/react/bold-duotone/library'

export function dashboard(): NavItem[] {
    return [
        {
            label: "Finance",
            icon: CardIcon,
            activeIcon: CardIcon,
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
            icon: UsersGroupRoundedIcon,
            activeIcon: UsersGroupRoundedIcon,
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
                        label: "Baby Dedications",
                        description: "Baby dedication records",
                        get href() {
                            return getPath(this.label, this.basePath);
                        },
                        basePath: this.href
                    },
                    {
                        label: "Transfers",
                        description: "Member transfers",
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
            icon: ThreeSquaresIcon,
            activeIcon: ThreeSquaresIcon,
            mobile: true,
            get children() {
                return [
                    {
                        label: "Homecells",
                        description: "Homecells",
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
            icon: LibraryIcon,
            activeIcon: LibraryIcon,
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
