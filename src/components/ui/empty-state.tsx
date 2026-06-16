"use client"

import React, { SVGProps } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { BsTrash } from "react-icons/bs"
import { Binoculars } from "lucide-react"
import { GiTwoCoins as Coins } from "react-icons/gi"
import { HiInboxStack as Tray } from "react-icons/hi2"
import { RiBubbleChartFill as Bubble, RiDraftFill } from "react-icons/ri"
import { HiMiniCalendarDays as Calendar, HiMiniWallet as Vault } from "react-icons/hi2"
import { PieChartIcon } from "../icons/PieChart"
import { ClipboardIcon } from "../icons/Clipboard"
import { Button } from "./button"
import { MissingFilesIcon } from "../icons/MissingFiles";
import { FileSearchIcon } from "../icons/FileSearch";
import { FinancialChartIcon } from "../icons/FinancialChart";


type EmptyStateVariant = "action" | "heading" | "both"

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
    type: EmptyStateType
    variant?: EmptyStateVariant
    context?: {
        label?: string
        period?: string
    }
    actionLabel?: string
    href?: string
    action?: React.ReactNode
}

type EmptyStateType =
    | "analyticsChart"
    | "assets"
    | "drafts"
    | "tithes"
    | "sunday"
    | "friday"
    | "homecell"
    | "events"
    | "tally"
    | "demographics"
    | "messages"
    | "inbox"
    | "observability"
    | "insights"
    | "trash"
    | "reports"
    | "filteredReports"
    | "exceptions"

interface EmptyStateConfig {
    description: string | ((ctx?: { label?: string; period?: string }) => string)
    heading?: string | ((ctx?: { label?: string; period?: string }) => string)
    actionLabel?: string
    href?: string
    Icon: React.ComponentType<SVGProps<SVGSVGElement> & { size?: number }>
    banner?: string
}

const ICON_SIZE = 36

const EMPTY_STATES: Record<EmptyStateType, EmptyStateConfig> = {
    assets: {
        description: "You haven't recorded any assets yet.",
        actionLabel: "Create an asset",
        href: "/finance/asset/add/",
        Icon: Vault
    },
    drafts: {
        description: "No drafts have been saved.",
        Icon: RiDraftFill
    },
    tithes: {
        description: "No tithe contributions have been added.",
        actionLabel: "Create tithes",
        href: "/finance/tithes/add/",
        Icon: Coins
    },
    sunday: {
        description: "No Sunday attendance data available.",
        actionLabel: "Create attendance data",
        href: "/attendance/sunday/add/",
        Icon: Calendar
    },
    friday: {
        description: "No Friday attendance data available.",
        actionLabel: "Create attendance data",
        href: "/attendance/friday/add/",
        Icon: Calendar
    },
    homecell: {
        description: "No homecell attendance data available.",
        actionLabel: "Create homecell",
        href: "/homecell/attendance/add/",
        Icon: Calendar
    },
    events: {
        description: "No scheduled events.",
        Icon: PieChartIcon
    },
    tally: {
        description: "No tally records.",
        Icon: PieChartIcon
    },
    demographics: {
        description: "No members have been added yet.",
        actionLabel: "Create a member",
        href: "/demographics/members/add/",
        Icon: Bubble
    },
    messages: {
        description: "You have no unread messages.",
        actionLabel: "Compose a message",
        href: "/messages/add/",
        Icon: Tray
    },
    inbox: {
        description: "You have no notifications.",
        actionLabel: "Create wellness post",
        href: "/feed/health/add/",
        Icon: Tray
    },
    observability: {
        description: "Observability data will appear once available.",
        Icon: Binoculars
    },
    insights: {
        description: "Insights will appear once data is ready.",
        Icon: PieChartIcon
    },
    trash: {
        heading: "No items in the trash",
        description: "Items in trash will be permanently deleted after 30 days.",
        Icon: BsTrash,
        banner: "Items in trash will be permanently deleted after 30 days."
    },
    reports: {
        heading: (ctx) =>
            ctx?.label
                ? `No ${ctx.label}`
                : "No data for this period",
        description: (ctx) =>
            ctx?.label
                ? `Add ${ctx.label} records to see them here.`
                : "No data for this period. Add records to see them here.",
        Icon: ClipboardIcon
    },
    filteredReports: {
        heading: "No matching reports",
        description: "Clear or adjust your filters to see more results.",
        Icon: PieChartIcon
    },
    exceptions: {
        heading: "No exceptions found",
        description: "Report exceptions are records that fall outside expected patterns, such as missing values, mismatched totals, or unusual entries.",
        Icon: FileSearchIcon
    },
    analyticsChart: {
        heading: "No chart data",
        description: "Chart data is not available for the selected KPI.",
        Icon: MissingFilesIcon
    }

}

function EmptyStateCard({
    config,
    variant,
    context,
    actionLabel: actionLabelOverride,
    href: hrefOverride,
    action: actionOverride
}: {
    config: EmptyStateConfig
    variant?: EmptyStateVariant
    context?: { label?: string; period?: string }
    actionLabel?: string
    href?: string
    action?: React.ReactNode
}) {
    const { Icon } = config

    const heading =
        typeof config.heading === "function"
            ? config.heading(context)
            : config.heading

    const description =
        typeof config.description === "function"
            ? config.description(context)
            : config.description

    const actionLabel =
        actionLabelOverride ?? config.actionLabel

    const href =
        hrefOverride ?? config.href

    const showHeading = variant === "heading" || variant === "both"
    const showAction = variant === "action" || variant === "both"

    return (
        <div className="flex flex-col items-center gap-y-4 text-center">
            <Icon className="size-32" />

            <div className="max-w-md">
                {showHeading && heading && (
                    <h5 className="text-xl text-center tracking-tight font-bold">
                        {heading}
                    </h5>
                )}

                <p className="text-sm text-center text-muted">
                    {description}
                </p>
            </div>

            {showAction && (
                actionOverride ? (
                    actionOverride
                ) : (
                    actionLabel && href && (
                        <Button asChild variant="outline">
                            <Link href={href}>
                                {actionLabel}
                            </Link>
                        </Button>
                    )
                )
            )}
        </div>
    )
}

export function EmptyState({
    type,
    variant = "both",
    className,
    context,
    actionLabel,
    href,
    action,
    ...props
}: EmptyStateProps) {
    const config = EMPTY_STATES[type]

    if (!config) return null

    return (
        <div
            {...props}
            data-empty-state
            className={cn(
                "relative w-full h-full flex items-center justify-center rounded-3xl border-[0px] border-dashed bg-linear-to-b from-surface to-white",
                className
            )}
        >
            {config.banner && (
                <div className="absolute top-0 inset-x-0 px-4">
                    <small className="block w-full p-2.5 text-xs text-center rounded-lg text-amber-700 bg-amber-100 dark:text-amber-500 dark:bg-amber-500/15">
                        {config.banner}
                    </small>
                </div>
            )}

            <EmptyStateCard
                config={config}
                variant={variant}
                context={context}
                actionLabel={actionLabel}
                href={href}
                action={action}
            />
        </div>
    )
}