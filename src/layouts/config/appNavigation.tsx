import { getPath } from "@/utils/get-path"
import { format, subMonths } from "date-fns"
import {
    IconUsers,
    type TablerIcon,
    IconClipboardTextFilled,
    IconCreditCardFilled,
} from "@tabler/icons-react"
import { type LucideIcon } from "lucide-react"
import { IconSvgElement } from '@hugeicons/react'
import { Calendar03Icon, ChartRoseIcon, FavouriteIcon, FolderDownloadIcon, Invoice04Icon, Layers02Icon, More02Icon, PurseIcon, UserMultiple02Icon, Wallet03Icon } from "@hugeicons/core-free-icons"

const getCurrentPeriod = (): string => {
    const now = new Date()
    const prevMonth = subMonths(now, 1)
    return format(prevMonth, "yyyy-MM")
}

interface BaseMenuItem {
    name: string
    description?: string
    pathname?: string
    permissions?: string[]
    showInBottomNav?: boolean
}

export interface MenuItem extends BaseMenuItem {
    icon: IconSvgElement
    activeIcon: TablerIcon | LucideIcon
    pages?: BaseMenuItem[]
}

export const STROKE_WIDTH = 1.5

export function getNavigation(period?: string, rid?: string){
    const currentPeriod = period ?? getCurrentPeriod()

    const navigationSchema: { 
        dashboard: MenuItem[]
        forms: MenuItem[]
    } = {
        dashboard: [
            // {
            //     name: "Feed",
            //     description: "Home",
            //     pathname: "/",
            //     icon: Comment01Icon,
            //     activeIcon: IconMessageFilled,
            //     showInBottomNav: true,
            // },
            {
                name: "Reports",
                description: "Reports",
                icon: ChartRoseIcon,
                activeIcon: IconClipboardTextFilled,
                showInBottomNav: true,
                pathname: `/reports`,
                get pages() {
                    const period = currentPeriod

                    return [
                        {
                            name: "Overview",
                            description: "Summary of key data across attendance, income, expenses, and tithes",
                            get pathname() {
                                return `/reports/overview?period=${period}`
                            },
                        },
                        {
                            name: "Attendance",
                            description: "Month-by-month performance breakdown",
                            get pathname() {
                                return `/reports/attendance?period=${period}`
                            },
                        },
                        {
                            name: "Finance",
                            description: "Month-by-month performance breakdown",
                            get pathname() {
                                return `/reports/finance?period=${period}`
                            },
                        },
                        {
                            name: "Tithes",
                            description: "Month-by-month performance breakdown",
                            get pathname() {
                                return `/reports/tithes?period=${period}`
                            },
                        },
                        {
                            name: "Insights",
                            description: "Trends and visual analytics across categories",
                            get pathname() {
                                return `/reports/insights?period=${period}`
                            },
                        },
                        {
                            name: "Compliance",
                            description: "Tracking of reporting and submission status",
                            get pathname() {
                                return `/reports/compliance?period=${period}`
                            },
                        },
                    ]
                },
            },
            {
                name: "Finance",
                description: "Finance",
                icon: Wallet03Icon,
                activeIcon: IconCreditCardFilled,
                pathname: `/finance`,
                showInBottomNav: true,
                get pages() {
                    const year = format(new Date(), "yyyy")

                    return [
                        {
                            name: "Overview",
                            description: "Finance",
                            get pathname() {
                                return `/finance/overview?fy=${year}`;
                            },
                        },
                        {
                            name: "Assets",
                            description: "Church Assets",
                            get pathname() {
                                return getPath(this.name, this.basePath);
                            },
                            basePath: this.pathname
                        },
                    ]
                }
            },
            {
                name: "People",
                description: "People",
                pathname: "/people",
                icon: UserMultiple02Icon,
                activeIcon: IconUsers,
                showInBottomNav: true,
                get pages() {
                    return [
                        {
                            name: "Overview",
                            description: "Members Summary",
                            get pathname() {
                                return getPath(this.name, this.basePath);
                            },
                            basePath: this.pathname
                        },
                        {
                            name: "Members",
                            description: "Members",
                            get pathname() {
                                return getPath(this.name, this.basePath);
                            },
                            basePath: this.pathname
                        },
                        {

                            name: "Newcomers",
                            description: "New members",
                            get pathname() {
                                return getPath(this.name, this.basePath);
                            },
                            basePath: this.pathname
                        },
                        {
                            name: "Baptism",
                            description: "Baptism",
                            get pathname() {
                                return getPath(this.name, this.basePath);
                            },
                            basePath: this.pathname
                        },
                        {
                            name: "Trash",
                            description: "Recently deleted members",
                            get pathname() {
                                return getPath(this.name, this.basePath);
                            },
                            basePath: this.pathname
                        },
                    ]
                },
            },
            {
                name: "Spaces",
                description: "Homecell and Ministries",
                pathname: "/spaces",
                icon: Layers02Icon,
                activeIcon: IconUsers,
                showInBottomNav: true,
                get pages() {
                    return [
                        {
                            name: "Overview",
                            description: "Groups summary",
                            get pathname() {
                                return getPath(this.name, this.basePath);
                            },
                            basePath: this.pathname
                        },
                        {
                            name: "Homecells",
                            description: "Homecells",
                            get pathname() {
                                return getPath(this.name, this.basePath);
                            },
                            basePath: this.pathname
                        },
                        {
                            name: "Ministry Teams",
                            description: "Ministry teams",
                            get pathname() {
                                return getPath(this.name, this.basePath);
                            },
                            basePath: this.pathname
                        },
                        {
                            name: "Meetings",
                            description: "Group resources and materials",
                            get pathname() {
                                return getPath(this.name, this.basePath);
                            },
                            basePath: this.pathname
                        },
                    ]
                },
            },
            {
                name: "Library",
                description: "Library",
                pathname: "/library",
                icon: FolderDownloadIcon,
                activeIcon: IconUsers,
                showInBottomNav: true,
                get pages() {
                    return [
                        {
                            name: "Overview",
                            description: "Members Summary",
                            get pathname() {
                                return getPath(this.name, this.basePath);
                            },
                            basePath: this.pathname
                        },
                    ]
                },
            },
        ],

        forms: [
            {
                name: "Attendance",
                description: "Homecell and Ministries",
                pathname: `/forms?cat=report&form=attendance&rid=${rid}`,
                icon: Calendar03Icon,
                activeIcon: IconUsers,
            },
            {
                name: "Income",
                description: "Homecell and Ministries",
                pathname: `/forms?cat=report&form=income&rid=${rid}`,
                icon: PurseIcon,
                activeIcon: IconUsers,
            },
            {
                name: "Expenses",
                description: "Homecell and Ministries",
                pathname: `/forms?cat=report&form=expenses&rid=${rid}`,
                icon: Invoice04Icon,
                activeIcon: IconUsers,
            },
            {
                name: "Tithes",
                description: "Homecell and Ministries",
                pathname: `/forms?cat=report&form=tithes&rid=${rid}`,
                icon: FavouriteIcon,
                activeIcon: IconUsers,
            },
            {
                name: "All Forms",
                description: "Reports, submissions, and advanced forms",
                pathname: "/forms",
                icon: More02Icon,
                activeIcon: IconUsers,
            }
        ]
    }

    return navigationSchema
}
