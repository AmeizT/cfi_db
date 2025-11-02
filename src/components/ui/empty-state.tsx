"use client"

import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { BsTrash } from "react-icons/bs"
import { Binoculars, Brain } from "lucide-react"
import { IconMatrix, IconTallymarks, IconTicket } from "@tabler/icons-react"
import { GiTwoCoins as Coins } from "react-icons/gi"
import { HiInboxStack as Tray } from "react-icons/hi2"
import { RiBubbleChartFill as Bubble, RiDraftFill } from "react-icons/ri"
import { HiMiniCalendarDays as Calendar, HiMiniWallet as Vault } from "react-icons/hi2"

interface EmptyStateProps extends React.AllHTMLAttributes<HTMLDivElement> {
    emptyStateFor: string
    variant?: "action" | "heading" | "both"
}

interface MessageItem {
    description: string
    emptyStateFor: string
    action?: string
    href?: string
    icon: React.JSX.Element
    heading?: string
    page?: string
}

interface MessageCardProps {
    message: MessageItem
    variant?: "action" | "heading" | "both"
    emptyStateFor?: string
}

const size = 36

const messages: MessageItem[] = [
    {
        description: "You haven't recorded any assets yet.",
        emptyStateFor: "assets",
        action: "Create an asset",
        href: "/finance/asset/add/",
        icon: <Vault size={size} />
    },
    {
        description: "No drafts have been saved.",
        emptyStateFor: "drafts",
        action: "",
        href: "",
        icon: <RiDraftFill size={size} />
    },
    {
        description: "No tithe contributions have been added.",
        emptyStateFor: "tithes",
        action: "Create tithes",
        href: "/finance/tithes/add/",
        icon: <Coins size={size} />
    },
    {
        description: "No Sunday attendance data available.",
        emptyStateFor: "sunday",
        action: "Create attendance data",
        href: "/attendance/sunday/add/",
        icon: <Calendar size={size} />
    },
    {
        description: "No Friday attendance data available.",
        emptyStateFor: "attendance",
        action: "Create attendance data",
        href: "/attendance/friday/add/",
        icon: <Calendar size={size} />
    },
    {
        description: "No homecell attendance data available.",
        emptyStateFor: "attendance",
        action: "Create homecell",
        href: "/homecell/attendance/add/",
        icon: <Calendar size={size} />
    },
    {
        description: "No scheduled events",
        emptyStateFor: "events",
        icon: <IconTicket size={size} />
    },
    {
        description: "No tally records",
        emptyStateFor: "tally",
        icon: <IconTallymarks size={size} />
    },
    {
        description: "No members have been added yet.",
        emptyStateFor: "demographics",
        action: "Create a member",
        href: "/demographics/members/add/",
        icon: <Bubble size={size} />
    },
    {
        description: "You have no unread messages.",
        emptyStateFor: "messages",
        action: "Compose a message",
        href: "/messages/add/",
        icon: <Tray size={size} />
    },
    {
        description: "You have no notifications.",
        emptyStateFor: "inbox",
        action: "Create wellness post",
        href: "/feed/health/add/",
        icon: <Tray size={size} />
    },
    {
        description: "Observability data will appear once available.",
        emptyStateFor: "observability",
        action: "Create homecell",
        href: "",
        icon: <Binoculars strokeWidth={1} size={size} />
    },
    {
        description: "Insights will be shown once there is data to analyze.",
        emptyStateFor: "insights",
        action: "Create homecell",
        href: "",
        icon: <Brain strokeWidth={1} size={size} />
    },
    {
        description: "Items in trash will be permanently deleted after 30 days.",
        heading: "No items in the trash",
        emptyStateFor: "trash",
        action: "Create homecell",
        href: "",
        icon: <BsTrash size={size} />
    },
    {
        description: "Auto-generated reports will appear here.",
        heading: "No reports available",
        emptyStateFor: "reports",
        action: "",
        href: "",
        icon: <IconMatrix size={size} />
    }
]

function EmptyStateMessage(props: MessageCardProps) {
    const { message, variant } = props

    return (
        <div data-variant={variant} className="h-fit flex flex-col items-center gap-y-4">
            <div className="p-6 flex justify-center items-center relative rounded-full bg-gradient-to-b from-gray-100 to-white dark:from-neutral-700/70 dark:to-neutral-950">
                <span className="w-20 h-20 flex justify-center items-center text-gray-500 dark:text-gray-300 bg-white dark:bg-neutral-950 rounded-full border border-gray-200 dark:border-neutral-600">
                    {message.icon}
                </span>
            </div>

            <div className="flex flex-col gap-y-2">
                {variant === "heading" || variant === "both" ? (
                    <h5 className="text-center text-gray-400 dark:text-white font-medium">
                        {message.heading}
                    </h5>
                ) : null}

                <p className="font-medium lg:text-sm text-gray-500 dark:text-neutral-200">
                    {message?.description}
                </p>
            </div>

            {variant === "action" || variant === "both" ?
                <div className="flex">
                    <Link href={message.href || ""} className="px-4 py-2 inline-flex flex-shrink-0 justify-center items-center rounded-lg leading-normal text-white text-sm font-semibold whitespace-nowrap bg-neutral-900 transition-colors">
                        <div className="flex items-center gap-x-2">
                            <span className="">
                                {message.action}
                            </span>

                            {/* <span className="flex">
                                <ArrowUpRightIcon size={14} weight="bold" />
                            </span> */}
                        </div>
                    </Link>
                </div> : null
            }
        </div>
    )
}

export function EmptyState({ variant, emptyStateFor, ...props }: EmptyStateProps) {
    const message = messages?.find(message => message?.emptyStateFor === emptyStateFor)

    return (
        <div {...props} data-empty-state="true" data-fallback-content={emptyStateFor} className={cn(`w-full h-full flex justify-center items-center relative`, props.className)}>
            {message?.emptyStateFor?.includes("trash") ? (
                <div className="px-4 w-full absolute inset-x-0 top-0">
                    <small className="p-2.5 w-full block text-center text-xs text-amber-700 bg-amber-100 dark:text-amber-500 dark:bg-amber-500/15 rounded-lg">
                        Items in trash will be permanently deleted after 30 days.
                    </small>
                </div>
            ) : null}

            {message &&
                <EmptyStateMessage
                    emptyStateFor={message.emptyStateFor}
                    message={message}
                    variant={variant}
                />
            }
        </div>
    )
}
