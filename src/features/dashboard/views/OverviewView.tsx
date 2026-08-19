"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { addMonths, format, isSameMonth } from "date-fns"
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useUser } from "@/hooks/query/use-user"
import { useMembersDirectory } from "@/features/people/members/hooks/use-members-directory"
import { useReports } from "@/features/reports/core/hooks/use-reports"
import { greetByTime } from "@/utils/greet-by-time"

import { FloatingVerseCard } from "../components/overview/FloatingVerseCard"
import { OverviewJethro } from "../components/overview/OverviewJethro"
import { OverviewMetrics } from "../components/overview/OverviewMetrics"
import { OverviewOperations, type AttentionItem } from "../components/overview/OverviewOperations"
import { InsightRotator } from "../components/insight-rotator";

type AttendanceRecord = {
    timestamp?: string
    start_time?: string
    category?: string
    special_event_name?: string
}

function isAttendanceRecord(value: unknown): value is AttendanceRecord {
    return Boolean(value) && typeof value === "object"
}

export function OverviewView({ initialNow }: { initialNow: string }) {
    const referenceNow = React.useMemo(() => new Date(initialNow), [initialNow])
    const [selectedMonth, setSelectedMonth] = React.useState(() => new Date(initialNow))
    const { data: user } = useUser()
    const year = format(selectedMonth, "yyyy")
    const month = format(selectedMonth, "MM")
    const reports = useReports({ year, month, pageSize: 20 })
    const members = useMembersDirectory({ page_size: 100 })
    const reportRows = reports.data ?? []
    const activeReport = reportRows[0]
    const greeting = greetByTime(referenceNow)

    const newMembers = members.data?.filter((member) => isSameMonth(new Date(member.created_at), selectedMonth)).length
    const reportsDue = reportRows.filter((report) => !["finalized", "reviewed", "approved", "archived"].includes(report.status)).length

    const attention: AttentionItem[] = reportRows
        .filter((report) => !["finalized", "reviewed", "approved", "archived"].includes(report.status))
        .slice(0, 4)
        .map((report) => ({
            id: report.id,
            title: `${format(new Date(report.period_start), "MMMM yyyy")} report`,
            context: report.status === "draft" ? "Monthly report · In progress" : `Monthly report · ${report.status}`,
            dueDate: report.period_end,
            href: "/reports/current",
        }))

    const upcoming = ((activeReport?.data?.attendances ?? []) as unknown[])
        .filter(isAttendanceRecord)
        .filter((item) => item.timestamp && new Date(item.timestamp) >= referenceNow)
        .sort((a, b) => new Date(a.timestamp ?? 0).getTime() - new Date(b.timestamp ?? 0).getTime())
        .slice(0, 3)

        const messages = [
            "You're making good progress this month",
            "2 sections still need your attention",
            // "Attendance is trending upward",
            "Your reporting history is getting stronger",
            "Almost there — one section left to complete",
            ]

    return (
        <main className="relative min-h-full overflow-x-hidden bg-[radial-gradient(circle_at_18%_0%,color-mix(in_srgb,var(--primary)_5%,transparent),transparent_28%),radial-gradient(circle_at_82%_12%,color-mix(in_srgb,var(--chart-4)_5%,transparent),transparent_28%)] px-4 pb-28 pt-7 sm:px-6 lg:px-8 lg:pt-9">
            <div className="mx-auto max-w-6xl space-y-7">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-center">
                    <div className="flex flex-col justify-center items-center">
                        <div className="mb-4">
                            <Image width={100} height={100} src="/brand/jethro/jethro-primary.svg" alt="Jethro Logo" />
                        </div>

                        <h1 className="text-center text-3xl font-semibold">
                            {greeting}
                            {user?.first_name ? (
                                <>
                                    ,{" "}
                                    <span className="text-primary">
                                        {user.first_name}
                                    </span>
                                    {/* {" 👋"} */}
                                </>
                            ) : (
                                " 👋"
                            )}
                        </h1>
                        {/* <p className="mt-1 text-center text-sm text-muted-foreground">Here&apos;s what&apos;s happening in your workspace today.</p> */}
                        <InsightRotator messages={messages} />
                    </div>
                </header>

                <OverviewJethro monthLabel={format(selectedMonth, "MMMM yyyy")} />

                <section>
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-sm font-semibold">At a glance</h2>
                        <div className="flex items-center gap-1.5">
                            <span className="mr-1 inline-flex h-9 items-center gap-2 rounded-full border border-border-subtle bg-background/80 px-3 text-xs font-semibold sm:text-sm">
                                <CalendarDays className="size-4 text-muted-foreground" />
                                {format(selectedMonth, "MMMM yyyy")}
                            </span>

                            <Button
                                size="icon"
                                variant="ghost"
                                className="rounded-full"
                                onClick={() =>
                                    setSelectedMonth((date) => addMonths(date, -1))
                                }
                                aria-label="Previous month"
                            >
                                <ChevronLeft />
                            </Button>

                            <Button
                                size="icon"
                                variant="ghost"
                                className="rounded-full"
                                onClick={() =>
                                    setSelectedMonth((date) => addMonths(date, 1))
                                }
                                aria-label="Next month"
                            >
                                <ChevronRight />
                            </Button>

                            {/* <Button
                                size="icon"
                                variant="ghost"
                                className="rounded-full"
                                aria-label="More overview actions"
                            >
                                <MoreHorizontal />
                            </Button> */}
                        </div>

                        {/* <button type="button" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"><SlidersHorizontal className="size-3.5" />Customize</button> */}
                    </div>
                    <OverviewMetrics
                        loading={reports.isLoading || members.isLoading}
                        values={{
                            reportsDue,
                            attendance: activeReport?.attendance_total,
                            newMembers,
                            tithes: activeReport ? Number(activeReport.tithe_total) : undefined,
                            currency: user?.assembly?.primary_currency ?? user?.assembly?.currency,
                            locale: user?.assembly?.locale,
                        }}
                    />
                </section>

                <OverviewOperations attention={attention} referenceDate={initialNow} />

                <section className="rounded-2xl border border-border-subtle bg-card/80 p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-sm font-semibold">Upcoming engagements</h2>
                        <Link href="/engagement/activities" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">View activities <ChevronRight className="size-3.5" /></Link>
                    </div>
                    {upcoming.length ? (
                        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                            {upcoming.map((item, index) => {
                                const date = new Date(item.timestamp!)
                                return (
                                    <article key={`${item.timestamp}-${index}`} className="flex min-w-60 items-center gap-3 border-r border-border-subtle pr-4 last:border-0">
                                        <time className="grid w-11 shrink-0 place-items-center rounded-lg border border-border-subtle bg-background py-1 text-center"><span className="text-[10px] font-bold uppercase text-primary">{format(date, "MMM")}</span><span className="text-base font-bold">{format(date, "d")}</span></time>
                                        <div className="min-w-0"><h3 className="truncate text-sm font-medium">{item.special_event_name || item.category || "Engagement"}</h3><p className="mt-1 text-xs text-muted-foreground">{item.start_time || "Time not set"}</p></div>
                                    </article>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="mt-4 flex items-center gap-3 rounded-xl px-0 py-0 text-sm text-muted-foreground"><CalendarDays className="size-5" />No upcoming engagements are available for this month.</div>
                    )}
                </section>
            </div>
            <FloatingVerseCard />
        </main>
    )
}
