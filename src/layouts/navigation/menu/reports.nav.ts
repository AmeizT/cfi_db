import { NavItem } from "../types"
import {
    Analytics03Icon,
    BookOpen02Icon,
    Note05Icon,
    PurseIcon,
    Target02Icon,
} from "@hugeicons/core-free-icons"
import { getCurrentYear } from "@/layouts/utils/get-current-year"
import { buildPeriod } from "../helpers/build-period"
import { ReadonlyURLSearchParams } from "next/navigation"
import { createQueryString } from "@/features/reports/core/lib/create-query-string"
import { AbacusIcon, BullseyeIcon, PeaPodIcon, PersonBowingIcon } from "@/assets/icons";
import { InboxArchiveIcon } from '@solar-icons/react/bold-duotone/inbox-archive'
import { RocketIcon } from '@solar-icons/react/bold-duotone/rocket'
import { NotebookMinimalisticIcon } from '@solar-icons/react/bold-duotone/notebook-minimalistic'
import { WalletIcon } from '@solar-icons/react/bold-duotone/wallet'
import { RoundGraphIcon } from '@solar-icons/react/bold-duotone/round-graph'
import { PieChart2Icon } from '@solar-icons/react/bold-duotone/pie-chart-2'
import { BackpackIcon } from '@solar-icons/react/bold-duotone/backpack'
import { DocumentsIcon } from '@solar-icons/react/bold-duotone/documents'
import { Notebook2Icon } from "@solar-icons/react/bold-duotone/notebook-2";
import { Book2Icon, BookBookmarkIcon } from "@solar-icons/react/bold-duotone";
import { NotesIcon } from "@solar-icons/react/bold-duotone";
import { ClipboardTextIcon } from '@solar-icons/react/bold-duotone/clipboard-text'

function getReportId(searchParams: ReadonlyURLSearchParams, reportId: string) {
    return (
        reportId ||
        searchParams.get("reportId") ||
        searchParams.get("reportid") ||
        searchParams.get("report_id") ||
        searchParams.get("id") ||
        undefined
    )
}

export function reports(
    searchParams: ReadonlyURLSearchParams,
    reportId: string
): NavItem[] {
    const currentReportId = getReportId(searchParams, reportId)

    function hrefFor(
        pathname: string,
        updates: Record<string, string | number | boolean | null | undefined> = {}
    ) {
        const params = createQueryString(searchParams, {
            period: buildPeriod({
                type: "year",
                value: Number(getCurrentYear()),
            }),
            reportId: currentReportId ?? null,
            reportid: null,
            report_id: null,
            ...updates,
        })

        return params ? `${pathname}?${params}` : pathname
    }

    return [
        {
            label: "Overview",
            description: "Reporting dashboard for KPIs, trends, and charts",
            icon: PieChart2Icon,
            activeIcon: PieChart2Icon,
            href: hrefFor("/reports/overview", { tab: null, view: null }),
            exact: true,
        },
        {
            label: "Report Activity",
            description: "Review queue, compliance status, and exceptions",
            icon: NotesIcon,
            activeIcon: NotesIcon,
            href: hrefFor("/reports/activity", { tab: null, view: null }),
        },
        {
            label: "Performance",
            description: "Actuals versus targets for core reporting modules",
            icon: RocketIcon,
            activeIcon: RocketIcon,
            href: hrefFor("/reports/performance", { tab: null, view: null }),
        },
        {
            label: "Finance",
            description: "Tithes, remittance, and financial activity reports",
            icon: BackpackIcon,
            activeIcon: BackpackIcon,
            href: hrefFor("/reports/finance/tithes", { tab: null, view: null }),
            children: [
                {
                    label: "Tithes",
                    href: hrefFor("/reports/finance/tithes", {
                        tab: null,
                        view: null,
                    }),
                },
                {
                    label: "Remittance",
                    href: hrefFor("/reports/finance/remittance", {
                        tab: null,
                        view: null,
                    }),
                },
                {
                    label: "Financial Activity",
                    href: hrefFor("/reports/financial-activity/statement", {
                        tab: null,
                        view: null,
                    }),
                },
            ],
        },
        {
            label: "Ministry",
            description: "Attendance, outreach, and ministry reporting",
            icon: NotebookMinimalisticIcon,
            activeIcon: NotebookMinimalisticIcon,
            href: hrefFor("/reports/ministry/attendance", { tab: null, view: null }),
            children: [
                {
                    label: "Attendance",
                    href: hrefFor("/reports/ministry/attendance", {
                        tab: null,
                        view: null,
                    }),
                },
                {
                    label: "Outreach",
                    href: hrefFor("/reports/ministry/outreach", {
                        tab: null,
                        view: null,
                    }),
                },
                {
                    label: "Check-ins",
                    href: hrefFor("/reports/ministry/check-ins", {
                        tab: null,
                        view: null,
                    }),
                    disabled: true,
                },
            ],
        },
    ]
}
