import type { LucideIcon } from "lucide-react"
import { CalendarClock, CircleDollarSign, UserPlus, Users } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export type OverviewMetricValues = {
    reportsDue: number
    attendance?: number
    newMembers?: number
    tithes?: number
    currency?: string
    locale?: string
}

type Metric = {
    label: string
    value: string
    context: string
    icon: LucideIcon
    tone: string
}

function number(value: number, locale?: string) {
    try {
        return new Intl.NumberFormat(locale || "en-BW").format(value)
    } catch {
        return new Intl.NumberFormat("en-BW").format(value)
    }
}

function money(value: number, currency?: string, locale?: string) {
    if (!currency) return number(value, locale)
    try {
        return new Intl.NumberFormat(locale || "en-BW", {
            style: "currency",
            currency,
            notation: value >= 100_000 ? "compact" : "standard",
            maximumFractionDigits: value >= 1_000 ? 1 : 2,
        }).format(value)
    } catch {
        return `${currency} ${number(value, locale)}`
    }
}

export function OverviewMetrics({ values, loading }: { values: OverviewMetricValues; loading: boolean }) {
    const metrics: Metric[] = [
        {
            label: "Reports Due",
            value: number(values.reportsDue, values.locale),
            context: "Due this month",
            icon: CalendarClock,
            tone: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
        },
        ...(values.attendance === undefined ? [] : [{
            label: "Total Attendance",
            value: number(values.attendance, values.locale),
            context: "Recorded this month",
            icon: Users,
            tone: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        }]),
        ...(values.newMembers === undefined ? [] : [{
            label: "New Members",
            value: number(values.newMembers, values.locale),
            context: "Joined this month",
            icon: UserPlus,
            tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        }]),
        ...(values.tithes === undefined ? [] : [{
            label: "Tithes (This Month)",
            value: money(values.tithes, values.currency, values.locale),
            context: "Recorded this month",
            icon: CircleDollarSign,
            tone: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
        }]),
    ]

    if (loading) {
        return <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-29 rounded-2xl" />)}</div>
    }

    return (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {metrics.map(({ label, value, context, icon: Icon, tone }) => (
                <article key={label} className="min-w-0 rounded-2xl border border-border-subtle bg-card/80 p-4 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.55)]">
                    <div className="flex items-center gap-2">
                        <span className={cn("grid size-8 shrink-0 place-items-center rounded-lg", tone)}><Icon className="size-4" /></span>
                        <h3 className="truncate text-xs font-medium text-muted-foreground">{label}</h3>
                    </div>
                    <p className="mt-2 truncate text-xl font-bold tracking-tight sm:text-2xl">{value}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{context}</p>
                </article>
            ))}
        </div>
    )
}
