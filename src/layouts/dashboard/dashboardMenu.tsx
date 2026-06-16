import { format, subMonths } from "date-fns"
import { getPath } from "@/utils/get-path"
import {
    IconUsers,
    type TablerIcon,
    IconMessageFilled,
    IconClipboardTextFilled,
} from "@tabler/icons-react"
import { type LucideIcon } from "lucide-react"
import { IconSvgElement } from '@hugeicons/react'
import { Calendar03Icon, ChartRoseIcon, Comment01Icon, Layers02Icon, UserMultiple02Icon } from '@hugeicons/core-free-icons'

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

export const dashboardMenu: {
    feed: MenuItem[]
    platform: MenuItem[]
    tools: MenuItem[]
} = {
    feed: [
        {
            name: "Stories",
            description: "Home",
            pathname: "/",
            icon: Comment01Icon,
            activeIcon: IconMessageFilled,
            showInBottomNav: true,
        },
    ],
    platform: [
        // {
        //     name: "Home",
        //     description: "Dashboard",
        //     pathname: "/dashboard",
        //     icon: Home08Icon,
        //     activeIcon: IconLayoutGridFilled,
        // },
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
            name: "Groups",
            description: "Homecell and Ministries",
            pathname: "/groups",
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
                        name: "Ministries",
                        description: "Homecells",
                        get pathname() {
                            return getPath(this.name, this.basePath);
                        },
                        basePath: this.pathname
                    },
                    {
                        name: "Resources",
                        description: "Group resources and materials",
                        get pathname() {
                            return getPath(this.name, this.basePath);
                        },
                        basePath: this.pathname
                    },
                ]
            },
        },
        
        // {
        //     name: "Attendance",
        //     description: "Attendance",
        //     pathname: "/attendance",
        //     icon: IconCalendarMonth,
        //     activeIcon: IconCalendarMonthFilled,
        //     showInBottomNav: true,
        //     get pages() {
        //         return [
        //             {
        //                 name: "Overview",
        //                 description: "Attendance Summary",
        //                 get pathname() {
        //                     return getPath(this.name, this.basePath)
        //                 },
        //                 basePath: this.pathname
        //             },
        //             {
        //                 name: "Services",
        //                 description: "Attendance",
        //                 get pathname() {
        //                     return getPath(this.name, this.basePath)
        //                 },
        //                 basePath: this.pathname
        //             },
        //             {
        //                 name: "Homecells",
        //                 description: "Homecell and Church Groups",
        //                 get pathname() {
        //                     return getPath(this.name, this.basePath)
        //                 },
        //                 basePath: this.pathname
        //             },
        //             {
        //                 name: "Tally",
        //                 description: "Attendance tally",
        //                 get pathname() {
        //                     return getPath(this.name, this.basePath)
        //                 },
        //                 basePath: this.pathname
        //             },
        //             {
        //                 name: "Events",
        //                 description: "Conference attendance",
        //                 get pathname() {
        //                     return getPath(this.name, this.basePath)
        //                 },
        //                 basePath: this.pathname
        //             },
        //         ]
        //     }
        // },
        // {
        //     name: "Finance",
        //     description: "Finance",
        //     icon: IconCreditCard,
        //     activeIcon: IconCreditCardFilled,
        //     pathname: `/finance`,
        //     showInBottomNav: true,
        //     get pages() {
        //         const year = format(new Date(), "yyyy")

        //         return [
        //             {
        //                 name: "Overview",
        //                 description: "Finance",
        //                 get pathname() {
        //                     return `/finance/overview?fy=${year}`;
        //                 },
        //             },
        //             {
        //                 name: "Assets",
        //                 description: "Church Assets",
        //                 get pathname() {
        //                     return getPath(this.name, this.basePath);
        //                 },
        //                 basePath: this.pathname
        //             },
        //             {
        //                 name: "Cashflow",
        //                 description: "Cashflow",
        //                 pathname: `/finance/cashflow?month=${format(new Date(), "MMM").toLowerCase()}&year=${format(new Date(), "yyyy")}`,
        //             },
        //             {
        //                 name: "Tithes",
        //                 description: "Tithes",
        //                 pathname: `/finance/tithes?month=${format(new Date(), "MMM").toLowerCase()}&year=${format(new Date(), "yyyy")}`,
        //             },
        //             {
        //                 name: "Trash",
        //                 description: "Recently deleted items",
        //                 get pathname() {
        //                     return getPath(this.name, this.basePath);
        //                 },
        //                 basePath: this.pathname
        //             },
        //         ]
        //     }
        // },
        {
            name: "Reports",
            description: "Reports",
            icon: ChartRoseIcon,
            activeIcon: IconClipboardTextFilled,
            showInBottomNav: true,
            pathname: `/reports`,
            get pages() {
                const month = format(subMonths(new Date(), 1), "MMMM").toLowerCase()
                const year = format(new Date(), "yyyy")

                return [
                    {
                        name: "Overview",
                        description: "Summary of key data across attendance, income, expenses, and tithes",
                        get pathname() {
                            return `/reports/overview?year=${year}`
                        },
                    },
                    {
                        name: "Statistics",
                        description: "Month-by-month performance breakdown",
                        get pathname() {
                            return `/reports/stats/monthly?month=${month}&year=${year}`
                        },
                    },
                    // {
                    //     name: "Annual",
                    //     description: "Year-to-date summaries and comparisons",
                    //     get pathname() {
                    //         return `/reports/stats/annual?year=${year}`
                    //     },
                    // },
                    {
                        name: "Insights",
                        description: "Trends and visual analytics across categories",
                        get pathname() {
                            return `/reports/insights?year=${year}`
                        },
                    },
                    // {
                    //     name: "Zones",
                    //     description: "Zone-level performance and summaries",
                    //     get pathname() {
                    //         return `/reports/zones?year=${year}`
                    //     },
                    //     permissions: ["isZoneAdmin"],
                    // },
                    {
                        name: "Compliance",
                        description: "Tracking of reporting and submission status",
                        get pathname() {
                            return `/reports/compliance?year=${year}`
                        },
                    },
                ]
            },
        },
        {
            name: "Events",
            description: "Events",
            pathname: "/events",
            icon: Calendar03Icon,
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
        
        // {
        //     name: "Insights",
        //     description: "",
        //     icon: IconChartPie,
        //     activeIcon: IconChartPieFilled,
        //     showInBottomNav: true,
        //     pathname: "/insights",
        //     get pages() {
        //         return [
        //             {
        //                 name: "Overview",
        //                 description: "Overview",
        //                 get pathname() {
        //                     return getPath(this.name, this.basePath);
        //                 },
        //                 basePath: this.pathname
        //             },
        //             {
        //                 name: "Compliance",
        //                 description: "Compliance Report",
        //                 get pathname() {
        //                     return getPath(this.name, this.basePath);
        //                 },
        //                 basePath: this.pathname
        //             },
        //         ]
        //     }
        // },
    ],
    tools: [
        // {
        //     name: "Library",
        //     description: "Library",
        //     pathname: "/library",
        //     icon: IconFolders,
        //     activeIcon: IconFoldersFilled,
        // },
        // {
        //     name: "Prayerboard",
        //     description: "Prayer Notes and Requests",
        //     pathname: "/feed/prayer",
        //     icon: IconChalkboard,
        //     activeIcon: IconChalkboard,
        // },
        // {
        //     name: "Notifications",
        //     description: "Notifications",
        //     pathname: "/",
        //     icon: IconBell,
        //     activeIcon: IconBellFilled,
        // },
        // {
        //     name: "Trash",
        //     description: "Trash",
        //     pathname: "/trash",
        //     icon: IconTrash,
        //     activeIcon: IconTrashFilled,
        //     pages: [
        //         {
        //             name: "Members",
        //             description: "Members Trash",
        //             pathname: "/trash/members",
        //         },
        //         {
        //             name: "Tithes",
        //             description: "Tithes",
        //             pathname: "/trash/tithes",
        //         },
        //     ]
        // },
    ],
}