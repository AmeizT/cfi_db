import { NavItem } from "../types"
import { updateQuery } from "../helpers/update-query.helper"
import { Analytics03Icon, ArchiveIcon, DatabaseExportIcon, Note05Icon } from "@hugeicons/core-free-icons"
import { getCurrentYear } from "@/layouts/utils/get-current-year"
import { buildPeriod } from "../helpers/build-period"
import { ReadonlyURLSearchParams } from "next/navigation"
import { buildTab } from "@/utils/build-tab"
import { createQueryString } from "@/features/reports/core/lib/create-query-string";

export function reports(searchParams: ReadonlyURLSearchParams, reportId: string): NavItem[] {
    const params = createQueryString(searchParams, { 
        period: buildPeriod({
            type: "year",
            value: Number(getCurrentYear()),
        }),
        reportid: reportId || "",
        tab: "monthly",
    })

    return [
        {
            label: "Reports",
            description: "Summary of all reports with quick access to statuses and actions",
            icon: ArchiveIcon,
            activeIcon: ArchiveIcon,
            get href() {  
                const params = updateQuery(searchParams, {
                    period: buildPeriod({
                        type: "year",
                        value: Number(getCurrentYear()),
                    }),
                })

                return `/reports/review-queue?${params}`
            },
        },
        // {
        //     label: "Analytics",
        //     description: "Visual insights, KPIs, and trends across all reporting categories",
        //     icon: Analytics03Icon,
        //     activeIcon: Analytics03Icon,
        //     get href() {  
        //         const params = updateQuery(searchParams, {
        //             period: buildPeriod({
        //                 type: "year",
        //                 value: Number(getCurrentYear()),
        //             }),
        //             tab: searchParams.get("tab") || buildTab("attendance", "sunday"),
        //         })

        //         return `/reports/analytics?${params}`
        //     },
        // },
        {
            label: "Statements",
            description: "Detailed breakdowns of report data by category (attendance, cashflow, tithes)",
            get href() {  
                const params = createQueryString(searchParams, {
                    period: buildPeriod({
                        type: "year",
                        value: Number(getCurrentYear()),
                    }),
                    reportid: reportId || "",
                })

                return `/reports/statements?${params}`
            },
            icon: Note05Icon,
            activeIcon: Note05Icon,
            children: [
                {
                    label: "Attendance",
                    href: `/reports/statements/attendance?${params}`
                },
                {
                    label: "Income & Expenditure",
                    href: `/reports/statements/finance?${params}`
                },
                {
                    label: "Giving",
                    href: `/reports/statements/tithes?${params}`
                },
                {
                    label: "Remittance",
                    href: `/reports/statements/remittance?${params}`
                },
                // {
                //     label: "Check-ins",
                //     get href() {
                //         const params = createQueryString(searchParams, { tab: "" })
                //         return `/reports/statements?${params}`
                //     },
                // },
                // {
                //     label: "Prayer Meetings",
                //     get href() {
                //         const params = createQueryString(searchParams, { tab: "" })
                //         return `/reports/statements?${params}`
                //     },
                // }
            ]
        },
        {
            label: "Data Sources",
            description: "Upload and manage external data sources for reports",
            icon: DatabaseExportIcon,
            activeIcon: DatabaseExportIcon,
            get href() {
                return `/reports/data-imports`
            },
        },
    ]
}