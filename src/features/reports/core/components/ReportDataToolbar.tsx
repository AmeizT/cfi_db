"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Loader2, SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { JethroLogo } from "@/features/jethro/components/JethroLogo"
import { useJethroSession } from "@/features/jethro/JethroSessionProvider"
import { createQueryString } from "@/features/reports/core/lib/create-query-string"
import {
    getReportSubmoduleHref,
    type ReportSubmoduleKey,
} from "@/features/reports/modules/config/report-submodules"
import type {
    ModulePageContext,
    ReportModuleKey,
    ReportSection,
} from "@/features/reports/modules/types/report-modules"
import { cn } from "@/lib/utils"

type ReportDataView = "monthly" | "cumulative"

export type ReportDataToolbarScope = {
    section: ReportSection
    module: ReportModuleKey
    pageContext?: ModulePageContext
    monthlySubmodule?: ReportSubmoduleKey | null
    label: string
    cumulativeUpdates?: Record<string, string | number | boolean | null | undefined>
}

function ViewModeSwitch({
    activeView,
    section,
    module,
    pageContext = "workspace",
    monthlySubmodule = null,
    label,
    cumulativeUpdates,
}: ReportDataToolbarScope & { activeView: ReportDataView }) {
    const searchParams = useSearchParams()
    const monthlyHref = getReportSubmoduleHref({
        section,
        module,
        searchParams,
        submodule: monthlySubmodule,
        updates: { status: null },
        pageContext,
    })
    const cumulativeHref = getReportSubmoduleHref({
        section,
        module,
        searchParams,
        submodule: "cumulative",
        updates: cumulativeUpdates,
        pageContext,
    })

    return (
        <div
            role="group"
            aria-label={`${label} data view`}
            className="inline-flex h-8 shrink-0 items-center rounded-full bg-zinc-100 dark:bg-surface p-0.5"
        >
            {([
                ["monthly", "Monthly", monthlyHref],
                ["cumulative", "Cumulative", cumulativeHref],
            ] as const).map(([value, text, href]) => (
                <Button
                    key={value}
                    asChild
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "h-full rounded-full px-4 font-medium shadow-none",
                        activeView === value
                            ? "bg-background font-semibold text-primary hover:bg-user-theme-50 hover:text-primary"
                            : "text-foreground hover:bg-transparent",
                    )}
                >
                    <Link href={href} aria-current={activeView === value ? "page" : undefined}>
                        {text}
                    </Link>
                </Button>
            ))}
        </div>
    )
}

export function ReportDataToolbarControls({
    activeView = "monthly",
    showSearch = true,
    ...scope
}: ReportDataToolbarScope & {
    activeView?: ReportDataView
    showSearch?: boolean
}) {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentSearch = searchParams.get("search") ?? ""

    function applySearch(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const search = String(formData.get("search") ?? "").trim()
        const query = createQueryString(searchParams, {
            search: search || null,
            page: 1,
        })
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    }

    return (
        <div className="flex min-w-0 flex-wrap items-center gap-3">
            <ViewModeSwitch activeView={activeView} {...scope} />
            {showSearch ? (
                <>
                    <Separator orientation="vertical" className="hidden data-[orientation=vertical]:h-4.5 sm:block" />
                    <form onSubmit={applySearch} role="search" className="min-w-48 flex-1 sm:flex-none">
                        <label className="relative block">
                            <span className="sr-only">Search {scope.label.toLowerCase()} records</span>
                            <SearchIcon
                                className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                                aria-hidden="true"
                            />
                            <input
                                key={currentSearch}
                                name="search"
                                type="search"
                                defaultValue={currentSearch}
                                placeholder="Search…"
                                className="h-8 w-full min-w-48 rounded-full border-0 bg-zinc-100 pl-8 pr-3 text-sm caret-primary outline-none placeholder:text-muted-foreground focus-visible:bg-zinc-200/60 focus-visible:ring-2 focus-visible:ring-primary dark:bg-neutral-800 dark:focus-visible:bg-neutral-900 sm:w-60"
                            />
                        </label>
                        <button type="submit" className="sr-only">Search</button>
                    </form>
                </>
            ) : null}
        </div>
    )
}

export function ReportSummarizeAction({ label }: { label: string }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { submitMessage, isSending } = useJethroSession()

    async function summarize() {
        const period = searchParams.get("period")?.replace("year:", "")
        const prompt = period
            ? `Summarize my ${period} ${label.toLowerCase()} records and highlight anything that needs attention.`
            : `Summarize my selected ${label.toLowerCase()} report and highlight anything that needs attention.`
        const conversationId = await submitMessage(prompt)
        if (conversationId) {
            router.push(`/ai?conversation=${encodeURIComponent(conversationId)}`)
        }
    }

    return (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 rounded-full px-3 hover:bg-primary/5"
            disabled={isSending}
            onClick={() => void summarize()}
        >
            {isSending ? (
                <Loader2 className="size-4 animate-spin text-purple-500" />
            ) : (
                <JethroLogo className="size-5" aria-hidden="true" />
            )}
            <span className="bg-linear-to-r from-pink-500 via-violet-500 to-sky-500 bg-clip-text text-transparent">
                Summarize
            </span>
        </Button>
    )
}

export function ReportCumulativeToolbar(props: ReportDataToolbarScope) {
    return (
        <div className="flex min-h-11 flex-wrap items-center justify-between gap-3 border-b border-border-subtle py-3">
            <ReportDataToolbarControls {...props} activeView="cumulative" showSearch={false} />
            <ReportSummarizeAction label={props.label} />
        </div>
    )
}
