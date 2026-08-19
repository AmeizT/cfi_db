"use client"

import Link from "next/link"
import { differenceInCalendarDays, format, formatDistanceToNowStrict } from "date-fns"
import { CalendarClock, ChevronRight, Clock3, FileText, History } from "lucide-react"

import { useRecentVisits } from "../../lib/recent-visits"

export type AttentionItem = {
    id: string | number
    title: string
    context: string
    dueDate: string
    href: string
}

function deadlineLabel(date: string, referenceDate: Date) {
    const days = differenceInCalendarDays(new Date(date), referenceDate)
    if (days < 0) return `${Math.abs(days)}d overdue`
    if (days === 0) return "Due today"
    return `${days} day${days === 1 ? "" : "s"} left`
}

export function OverviewOperations({ attention, referenceDate }: { attention: AttentionItem[]; referenceDate: string }) {
    const visits = useRecentVisits()
    const now = new Date(referenceDate)

    return (
        <div className="grid gap-4 lg:grid-cols-[1.08fr_.92fr]">
            <section className="overflow-hidden rounded-2xl border border-border-subtle bg-card/80 p-4 sm:p-5">
                <h2 className="text-sm font-semibold">Needs your attention</h2>
                <div className="mt-3 divide-y divide-border-subtle">
                    {attention.length ? attention.map((item) => {
                        const overdue = differenceInCalendarDays(new Date(item.dueDate), now) < 0
                        return (
                            <Link key={item.id} href={item.href} className="group flex items-center gap-3 py-3 first:pt-1">
                                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400"><CalendarClock className="size-4" /></span>
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate text-sm font-medium">{item.title}</span>
                                    <span className="block truncate text-xs text-muted-foreground">{item.context} · Due {format(new Date(item.dueDate), "MMM d, yyyy")}</span>
                                </span>
                                <span className={overdue ? "rounded-full bg-destructive/10 px-2 py-1 text-[11px] font-medium text-destructive" : "rounded-full bg-primary/8 px-2 py-1 text-[11px] font-medium text-primary"}>{deadlineLabel(item.dueDate, now)}</span>
                                <ChevronRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5" />
                            </Link>
                        )
                    }) : (
                        <div className="flex items-center gap-3 py-7 text-sm text-muted-foreground">
                            <span className="grid size-9 place-items-center rounded-full bg-emerald-500/10 text-emerald-600"><Clock3 className="size-4" /></span>
                            Nothing needs immediate attention.
                        </div>
                    )}
                </div>
                <Link href="/reports" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">View all reports <ChevronRight className="size-3.5" /></Link>
            </section>

            <section className="overflow-hidden rounded-2xl border border-border-subtle bg-card/80 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-sm font-semibold">Recently visited</h2>
                    <History className="size-4 text-muted-foreground" />
                </div>
                <div className="mt-3 divide-y divide-border-subtle">
                    {visits.length ? visits.map((visit) => (
                        <Link key={visit.href} href={visit.href} className="group flex items-center gap-3 py-3 first:pt-1">
                            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/8 text-primary"><FileText className="size-4" /></span>
                            <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-medium">{visit.label}</span>
                                <span className="block truncate text-xs text-muted-foreground">{visit.category}</span>
                            </span>
                            <time className="shrink-0 text-[11px] text-muted-foreground">{formatDistanceToNowStrict(new Date(visit.visitedAt), { addSuffix: true })}</time>
                        </Link>
                    )) : (
                        <div className="flex items-center gap-3 py-7 text-sm text-muted-foreground">
                            <span className="grid size-9 place-items-center rounded-lg bg-muted"><History className="size-4" /></span>
                            Pages you open will appear here.
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
