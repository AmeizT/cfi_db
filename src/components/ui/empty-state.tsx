"use client"

import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { BsTrash } from "react-icons/bs"
import { Binoculars, Users } from "lucide-react"
import { GiTwoCoins as Coins } from "react-icons/gi"
import { HiInboxStack as Tray } from "react-icons/hi2"
import { RiDraftFill } from "react-icons/ri"
import { HiMiniCalendarDays as Calendar, HiMiniWallet as Vault } from "react-icons/hi2"
import { PieChartIcon } from "../icons/PieChart"
import { ClipboardIcon } from "../icons/Clipboard"
import { Button } from "./button"
import { MissingFilesIcon } from "../icons/MissingFiles"
import { FileSearchIcon } from "../icons/FileSearch"
import { DropletIcon, RocketIcon, Target02Icon, UserMultiple02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { OuterSpaceIllustration, QuietStreetIllustration } from "@/assets/icons/illustrations";
import { RainingIllustration } from "@/assets/icons/illustrations/RainingIllustration";
import { RemoteCabinIllustration } from "@/assets/icons/illustrations/RemoteCabinIllustration";

const PerformanceIcon = (
  props: Omit<React.ComponentProps<typeof HugeiconsIcon>, "icon">
) => <HugeiconsIcon icon={Target02Icon} {...props} />

const BaptismIcon = (
  props: Omit<React.ComponentProps<typeof HugeiconsIcon>, "icon">
) => <HugeiconsIcon icon={DropletIcon} {...props} />

const DemographicsIcon = (
  props: Omit<React.ComponentProps<typeof HugeiconsIcon>, "icon">
) => <HugeiconsIcon icon={UserMultiple02Icon} {...props} />


const RocketTakeoffIcon = (
  props: Omit<React.ComponentProps<typeof HugeiconsIcon>, "icon">
) => <HugeiconsIcon icon={RocketIcon} {...props} />

type EmptyStateVariant = "action" | "heading" | "both"
type EmptyStateSize = "compact" | "full"

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
    secondaryAction?: React.ReactNode
    title?: string
    description?: string
    icon?: React.ReactNode
    size?: EmptyStateSize
}

type EmptyStateType =
    | "analyticsChart"
    | "assets"
    | "baptisms"
    | "babyDedications"
    | "demographics"
    | "drafts"
    | "events"
    | "exceptions"
    | "filteredReports"
    | "financialTransactions"
    | "formerMembers"
    | "friday"
    | "homecell"
    | "households"
    | "inbox"
    | "insights"
    | "messages"
    | "observability"
    | "onboarding"
    | "performance"
    | "reports"
    | "sunday"
    | "tally"
    | "teams"
    | "tithes"
    | "trash"

interface EmptyStateConfig {
    description: string | ((ctx?: { label?: string; period?: string }) => string)
    heading?: string | ((ctx?: { label?: string; period?: string }) => string)
    actionLabel?: string
    href?: string
    Icon: React.ComponentType<{
        className?: string
        size?: number | string
    }>
    banner?: string
}

const EMPTY_STATES: Record<EmptyStateType, EmptyStateConfig> = {
    assets: {
        description: "You haven't recorded any assets yet.",
        actionLabel: "Create an asset",
        href: "/finance/asset/add/",
        Icon: Vault
    },
    baptisms: {
        heading: "No baptisms recorded or scheduled",
        description: "Recorded and upcoming baptisms will appear here.",
        actionLabel: "Schedule baptism",
        href: "#",
        Icon: RainingIllustration
    },
    babyDedications: {
        heading: "No baby dedications recorded or scheduled",
        description: "Recorded and upcoming baby dedications will appear here.",
        actionLabel: "Schedule dedication",
        href: "#",
        Icon: RainingIllustration
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
        heading: "No homecell found",
        description: "Create a homecell to organize members, meetings, and activities.",
        actionLabel: "Create homecell",
        href: "#",
        Icon: QuietStreetIllustration
    },
    households: {
        heading: "No households found",
        description: "Create a household to group related members and manage their shared information.",
        actionLabel: "Create household",
        href: "#",
        Icon: RemoteCabinIllustration
    },
    events: {
        description: "No scheduled events.",
        Icon: PieChartIcon
    },
    tally: {
        description: "No tally records.",
        Icon: PieChartIcon
    },
    teams: {
        description: "No teams have been created.",
        actionLabel: "Create a team",
        href: "/teams/add/",
        Icon: Users
    },
    demographics: {
        description: "No members have been added yet.",
        actionLabel: "Create a member",
        href: "/demographics/members/add/",
        Icon: DemographicsIcon
    },
    messages: {
        description: "You have no unread messages.",
        actionLabel: "Compose a message",
        href: "/messages/add/",
        Icon: Tray
    },
    onboarding: {
        heading: "No members in onboarding",
        description: "Members currently going through the onboarding process will appear here.",
        Icon: OuterSpaceIllustration
    },
    formerMembers: {
        description: "No former members have been recorded.",
        Icon: DemographicsIcon
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
    performance: {
        heading: "No performance data",
        description: "Set monthly or yearly targets to start tracking performance against your goals.",
        Icon: PerformanceIcon,
        href: "/reports/performance/tithes",
        actionLabel: "Set performance targets"
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
    financialTransactions: {
        heading: "No financial transactions",
        description: "Financial transactions will appear here once they are recorded.",
        Icon: Vault,
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
    action: actionOverride,
    secondaryAction,
    title,
    description: descriptionOverride,
    icon,
    size = "full",
}: {
    config: EmptyStateConfig
    variant?: EmptyStateVariant
    context?: { label?: string; period?: string }
    actionLabel?: string
    href?: string
    action?: React.ReactNode
    secondaryAction?: React.ReactNode
    title?: string
    description?: string
    icon?: React.ReactNode
    size?: EmptyStateSize
}) {
    const { Icon } = config

    const heading = title ?? (
        typeof config.heading === "function"
            ? config.heading(context)
            : config.heading
    )

    const description = descriptionOverride ?? (
        typeof config.description === "function"
            ? config.description(context)
            : config.description
    )

    const actionLabel =
        actionLabelOverride ?? config.actionLabel

    const href =
        hrefOverride ?? config.href

    const showHeading = variant === "heading" || variant === "both"
    const showAction = variant === "action" || variant === "both"

    return (
        <div className={cn("flex flex-col items-center text-center", size === "compact" ? "gap-y-2" : "gap-y-4")}>
            {icon ?? <Icon className={cn("text-olive-300", size === "compact" ? "size-12" : "size-48")} />}

            <div className="max-w-md">
                {showHeading && heading && (
                    <h5 className="text-lg text-center font-semibold">
                        {heading}
                    </h5>
                )}

                <p className="max-w-xs text-sm text-center text-muted">
                    {description}
                </p>
            </div>

            {showAction && (
                actionOverride ? (
                    actionOverride
                ) : (
                    actionLabel && href && (
                        <Button asChild>
                            <Link href={href} className="h-9">
                                {actionLabel}
                            </Link>
                        </Button>
                    )
                )
            )}
            {secondaryAction}
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
    secondaryAction,
    title,
    description,
    icon,
    size = "full",
    ...props
}: EmptyStateProps) {
    const config = EMPTY_STATES[type]

    if (!config) return null

    return (
        <div
            {...props}
            data-empty-state
            className={cn(
                "relative w-full h-full flex items-center justify-center border-0 border-dashed",
                className
            )}
        >
            {/* {config.banner && (
                <div className="absolute top-0 inset-x-0 px-4">
                    <small className="block w-full p-2.5 text-xs text-center rounded-lg text-amber-700 bg-amber-100 dark:text-amber-500 dark:bg-amber-500/15">
                        {config.banner}
                    </small>
                </div>
            )} */}

            <EmptyStateCard
                config={config}
                variant={variant}
                context={context}
                actionLabel={actionLabel}
                href={href}
                action={action}
                secondaryAction={secondaryAction}
                title={title}
                description={description}
                icon={icon}
                size={size}
            />
        </div>
    )
}
