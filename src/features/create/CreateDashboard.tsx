"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
    ArrowRight,
    Baby,
    BookOpen,
    BriefcaseBusiness,
    ChevronRight,
    CircleDollarSign,
    Droplets,
    FileText,
    House,
    PenLine,
    ReceiptText,
    Search,
    Upload,
    Users,
    UsersRound,
} from "lucide-react"

import { getReportWizardSectionByRoute } from "@/features/report-wizard/config/report-types"
import { reportStatusLabel } from "@/features/reports/workflow/components/ReportStatusBadge"
import { formatReportPeriod } from "@/features/reports/workflow/format"
import type { WorkflowReport } from "@/features/reports/workflow/types"
import { getMonthlyReportResumeSection } from "./monthly-report/routing"
import type { CreateCardItem, SetupTab } from "./types"

type CreateDashboardProps = {
    submitted: number
    total: number
    currentReport?: WorkflowReport
    reportLoading: boolean
    reportOpening: boolean
    onOpenSetup: (tab?: SetupTab) => void
    onOpenTemplates: () => void
    onToast: (message: string) => void
}

const peopleCards: CreateCardItem[] = [
    {
        title: "Members",
        description: "Add or manage church members",
        icon: Users,
        action: "form",
        href: "/create/members",
        accent: "purple",
    },
    {
        title: "Households",
        description: "Create and manage households",
        icon: House,
        action: "form",
        href: "/create/households",
        accent: "rose",
    },
    {
        title: "Baptism",
        description: "Record and manage baptism entries",
        icon: Droplets,
        action: "toast",
        accent: "blue",
    },
    {
        title: "Baby dedication",
        description: "Record baby dedication events",
        icon: Baby,
        action: "toast",
        accent: "gold",
    },
    {
        title: "Homecells",
        description: "Create and manage homecells",
        icon: UsersRound,
        action: "form",
        href: "/create/homecells",
        accent: "teal",
    },
]

const financeCards: CreateCardItem[] = [
    {
        title: "Assets",
        description: "Add or update church assets",
        icon: BriefcaseBusiness,
        action: "form",
        href: "/create/assets",
        accent: "blue",
    },
    // {
    //     title: "Revenue record",
    //     description: "Record tithes and other revenue",
    //     icon: CircleDollarSign,
    //     action: "toast",
    //     accent: "teal",
    // },
    // {
    //     title: "Expense record",
    //     description: "Record overhead and variable expenses",
    //     icon: ReceiptText,
    //     action: "toast",
    //     accent: "rose",
    // },
]

const reportCards: CreateCardItem[] = [
    {
        title: "Templates",
        description: "Start from a saved finance or reporting template",
        icon: FileText,
        action: "templates",
        accent: "purple",
    },
    {
        title: "Manual entry",
        description: "Enter records in the current monthly report",
        icon: PenLine,
        action: "report",
        tab: "manual",
        accent: "gold",
    },
    {
        title: "Uploads",
        description: "Import attendance or finance data from a file",
        icon: Upload,
        action: "report",
        tab: "uploads",
        accent: "teal",
    },
]

const baseCard =
    "group relative flex border border-border-subtle bg-card text-card-foreground transition duration-200 hover:border-primary/20 hover:shadow-lg"

function TileCard({
    item,
    onOpenSetup,
    onOpenTemplates,
    onToast,
}: {
    item: CreateCardItem
    onOpenSetup: (tab?: SetupTab) => void
    onOpenTemplates: () => void
    onToast: (message: string) => void
}) {
    const router = useRouter()
    const Icon = item.icon

    return (
        <button
            type="button"
            onClick={() => {
                if (item.href) {
                    router.push(item.href)
                    return
                }
                if (item.action === "report" || item.action === "setup") {
                    onOpenSetup(item.tab)
                    return
                }
                if (item.action === "templates") {
                    onOpenTemplates()
                    return
                }
                onToast(`Opening ${item.title}…`)
            }}
            className={`${baseCard} min-h-42 flex-col overflow-hidden rounded-[14px] p-5 text-left`}
        >
            <span className="relative z-10 mb-3.5 grid size-10 place-items-center rounded-[11px] bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-5" strokeWidth={1.75} />
            </span>
            <h3 className="relative z-10 text-[14.5px] font-semibold">{item.title}</h3>
            <p className="relative z-10 mt-1 text-[12.5px] leading-[1.45] text-muted-foreground">
                {item.description}
            </p>
            <GradientCone accent={item.accent} />
        </button>
    )
}

import type { CardAccent } from "./types"
import { cn } from "@/lib/utils"

const coneStyles: Record<
    CardAccent,
    {
        ring1: string
        ring2: string
        ring3: string
        ring4: string
        ring5: string
        icon: string
    }
> = {
    purple: {
        ring1: "bg-violet-500/8 dark:bg-violet-400/10",
        ring2: "bg-violet-500/12 dark:bg-violet-400/15",
        ring3: "bg-violet-500/16 dark:bg-violet-400/20",
        ring4: "bg-violet-500/22 dark:bg-violet-400/28",
        ring5: "bg-violet-500/35 dark:bg-violet-400/40",
        icon: "text-violet-500 dark:text-violet-400",
    },

    gold: {
        ring1: "bg-amber-400/8 dark:bg-amber-400/10",
        ring2: "bg-amber-400/12 dark:bg-amber-400/15",
        ring3: "bg-amber-400/16 dark:bg-amber-400/20",
        ring4: "bg-amber-400/22 dark:bg-amber-400/28",
        ring5: "bg-amber-400/35 dark:bg-amber-400/40",
        icon: "text-amber-500 dark:text-amber-400",
    },

    rose: {
        ring1: "bg-rose-400/8 dark:bg-rose-400/10",
        ring2: "bg-rose-400/12 dark:bg-rose-400/15",
        ring3: "bg-rose-400/16 dark:bg-rose-400/20",
        ring4: "bg-rose-400/22 dark:bg-rose-400/28",
        ring5: "bg-rose-400/35 dark:bg-rose-400/40",
        icon: "text-rose-500 dark:text-rose-400",
    },

    blue: {
        ring1: "bg-blue-400/8 dark:bg-blue-400/10",
        ring2: "bg-blue-400/12 dark:bg-blue-400/15",
        ring3: "bg-blue-400/16 dark:bg-blue-400/20",
        ring4: "bg-blue-400/22 dark:bg-blue-400/28",
        ring5: "bg-blue-400/35 dark:bg-blue-400/40",
        icon: "text-blue-500 dark:text-blue-400",
    },

    teal: {
        ring1: "bg-teal-400/8 dark:bg-teal-400/10",
        ring2: "bg-teal-400/12 dark:bg-teal-400/15",
        ring3: "bg-teal-400/16 dark:bg-teal-400/20",
        ring4: "bg-teal-400/22 dark:bg-teal-400/28",
        ring5: "bg-teal-400/35 dark:bg-teal-400/40",
        icon: "text-teal-500 dark:text-teal-400",
    },
}

const inverseConeStyles = {
    ring1: "bg-primary-foreground/[0.06]",
    ring2: "bg-primary-foreground/[0.10]",
    ring3: "bg-primary-foreground/[0.14]",
    ring4: "bg-primary-foreground/[0.18]",
    ring5: "bg-primary-foreground/[0.24]",
}

export function GradientCone({
    accent = "purple",
    variant = "default",
}: {
    accent?: CardAccent
    variant?: "default" | "inverse"
}) {
    const colors = variant === "inverse" ? inverseConeStyles : coneStyles[accent]

    return (
        <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 right-0 size-36.25 overflow-hidden"
        >
            <span
                className={cn(
                    "absolute -bottom-22.5 -right-22.5 size-45 rounded-full",
                    colors.ring1,
                )}
            />

            <span
                className={cn(
                    "absolute -bottom-18.25 -right-18.25 size-36.5 rounded-full",
                    colors.ring2,
                )}
            />

            <span
                className={cn(
                    "absolute -bottom-[56px] -right-[56px] size-[112px] rounded-full",
                    colors.ring3,
                )}
            />

            <span
                className={cn(
                    "absolute -bottom-[39px] -right-[39px] size-[78px] rounded-full",
                    colors.ring4,
                )}
            />

            <span
                className={cn(
                    "absolute -bottom-[22px] -right-[22px] size-[44px] rounded-full",
                    colors.ring5,
                )}
            />
        </div>
    )
}

function RowCard({
    item,
    onOpenSetup,
    onOpenTemplates,
    onToast,
    className,
    disabled,
}: {
    item: CreateCardItem
    onOpenSetup: (tab?: SetupTab) => void
    onOpenTemplates: () => void
    onToast: (message: string) => void
    className?: string
    disabled?: boolean
}) {
    const router = useRouter()
    const Icon = item.icon
    const accent = item.accent ?? "purple"
    const colors = coneStyles[accent]

    return (
        <button
            type="button"
            disabled={disabled}
            onClick={() => {
                if (item.href) {
                    router.push(item.href)
                    return
                }
                if (item.action === "report" || item.action === "setup") {
                    onOpenSetup(item.tab)
                    return
                }
                if (item.action === "templates") {
                    onOpenTemplates()
                    return
                }
                onToast(`Opening ${item.title}…`)
            }}
            className={cn(
                baseCard,
                `
                    group
                    relative
                    h-full
                    min-h-0
                    overflow-hidden
                    rounded-[18px]
                    p-6
                    text-left
                    disabled:pointer-events-none
                    disabled:opacity-60
                `,
                className,
            )}
        >
            {/* Icon */}
            <span
                className={cn(
                    "absolute right-6 top-6 z-20",
                    colors.icon,
                )}
            >
                <Icon
                    className="size-6"
                    strokeWidth={1.75}
                />
            </span>

            {/* Content */}
            <div className="relative z-20 flex h-full flex-col justify-end">
                <div className="max-w-[75%]">
                    <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-card-foreground">
                        {item.title}
                    </h3>

                    <p className="mt-1 text-[13px] leading-[1.45] text-muted-foreground">
                        {item.description}
                    </p>
                </div>

                <span className="mt-4 grid size-8 place-items-center rounded-full bg-zinc-100 dark:bg-surface text-foreground transition duration-200 group-hover:translate-x-0.5 group-hover:bg-accent">
                    <ArrowRight
                        className="size-4"
                        strokeWidth={1.75}
                    />
                </span>
            </div>

            <GradientCone accent={accent} />
        </button>
    )
}

export function CreateDashboard({
    submitted,
    total,
    currentReport,
    reportLoading,
    reportOpening,
    onOpenSetup,
    onOpenTemplates,
    onToast,
}: CreateDashboardProps) {
    const [query, setQuery] = useState("")
    const q = query.trim().toLowerCase()

    const filteredReports = useMemo(
        () => reportCards.filter((item) => !q || `${item.title} ${item.description}`.toLowerCase().includes(q)),
        [q],
    )
    const filteredPeople = useMemo(
        () => peopleCards.filter((item) => !q || `${item.title} ${item.description}`.toLowerCase().includes(q)),
        [q],
    )
    const filteredFinance = useMemo(
        () => financeCards.filter((item) => !q || `${item.title} ${item.description}`.toLowerCase().includes(q)),
        [q],
    )

    const circumference = 138.2
    const ringOffset = circumference * (1 - submitted / total)
    const reportExists = Boolean(currentReport?.id)
    const reportCompleted = currentReport?.status === "submitted" || currentReport?.status === "locked"
    const reportPeriodLabel = currentReport
        ? formatReportPeriod(currentReport.period_start)
        : "Current period"
    const resumeSection = currentReport
        ? getMonthlyReportResumeSection(currentReport)
        : "attendance"
    const resumeLabel = getReportWizardSectionByRoute(resumeSection).navigationLabel
        ?? getReportWizardSectionByRoute(resumeSection).label
    const reportActionLabel = reportLoading
        ? "Loading report…"
        : reportOpening
            ? "Opening report…"
            : reportCompleted
                ? "View report"
                : reportExists
                    ? "Continue report"
                    : "Start report"
    const currentStatusLabel = currentReport
        ? reportStatusLabel(currentReport.status)
        : "Loading"

    return (
        <main className="flex-1">
            <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-start gap-10 px-4 pb-20 pt-11 sm:px-8 xl:grid-cols-[minmax(0,1fr)_340px]">
                <div className="min-w-0">
                    <div className="mb-10">
                        <h1 className="text-[34px] font-bold leading-[1.15] tracking-[-0.02em]">
                            Good evening, Ellerie
                        </h1>
                        <p className="mb-6 mt-1 text-base text-muted-foreground">
                            What would you like to create?
                        </p>

                        <div className="flex flex-col items-start gap-2.5 sm:flex-row sm:items-center sm:gap-4">
                            <label className="flex w-full max-w-[480px] flex-1 items-center gap-2.5 rounded-[10px] border border-input bg-card px-3.5 py-3 transition focus-within:border-ring focus-within:ring-4 focus-within:ring-ring/10">
                                <Search className="size-[17px] text-muted-foreground" strokeWidth={1.75} />
                                <input
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                    className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                                    placeholder="Search create options…"
                                />
                                <kbd className="rounded-[5px] border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground">
                                    /
                                </kbd>
                            </label>

                            <button
                                type="button"
                                onClick={() => onToast("Opening pending reports…")}
                                className="flex items-center gap-2 border-b border-transparent px-1 py-2 text-[13.5px] font-medium text-muted-foreground transition hover:border-primary hover:text-primary"
                            >
                                <span className="size-1.75 rounded-full bg-[#c8891a]" />
                                {Math.max(total - submitted, 0)} reports pending this year
                            </button>
                        </div>
                    </div>

                    <section className="mb-11">
                        <div className="mb-4 flex items-baseline justify-between">
                            <h2 className="text-[17px] font-semibold tracking-[-0.01em]">Reporting</h2>
                            <span className="text-[12.5px] text-muted-foreground">
                                Due the 5th of each month
                            </span>
                        </div>

                        <div className="grid gap-3.5 md:grid-cols-[1.15fr_1fr]">
                            <button
                                type="button"
                                onClick={() => onOpenSetup()}
                                disabled={reportLoading || reportOpening}
                                aria-busy={reportOpening}
                                className="group relative flex min-h-77.5 flex-col justify-between overflow-hidden rounded-[14px] bg-primary p-6 text-left text-primary-foreground transition duration-200 hover:shadow-xl disabled:pointer-events-none disabled:opacity-60"
                            >
                                <div className="relative z-10">
                                    <div className="mb-4.5 flex items-start justify-between">
                                        <div
                                            className="relative size-13"
                                            title={`${submitted} of ${total} submitted this year`}
                                        >
                                            <svg
                                                width="52"
                                                height="52"
                                                viewBox="0 0 52 52"
                                                className="-rotate-90"
                                            >
                                                <circle
                                                    cx="26"
                                                    cy="26"
                                                    r="22"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    opacity="0.18"
                                                    strokeWidth="4"
                                                />
                                                <circle
                                                    cx="26"
                                                    cy="26"
                                                    r="22"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                    strokeLinecap="round"
                                                    strokeDasharray={circumference}
                                                    strokeDashoffset={ringOffset}
                                                />
                                            </svg>
                                            <span className="absolute inset-0 grid place-items-center text-xs font-bold">
                                                {submitted}/{total}
                                            </span>
                                        </div>
                                        <span className="rounded-full border border-primary-foreground/20 px-2.5 py-1 text-xs font-medium text-primary-foreground/75">
                                            {reportPeriodLabel}
                                        </span>
                                    </div>

                                    <h3 className="text-[21px] font-bold tracking-[-0.01em]">
                                        Monthly report
                                    </h3>
                                    <p className="mt-2 max-w-[34ch] text-sm leading-6 text-primary-foreground/70">
                                        Step through attendance, tithes, and expenses for this reporting period.
                                    </p>
                                </div>

                                <span className="relative z-10 inline-flex w-fit items-center gap-2 rounded-[10px] bg-primary-foreground px-4 py-2.5 text-sm font-semibold text-primary transition group-hover:gap-3 group-hover:bg-primary-foreground/90">
                                    {reportActionLabel}
                                    <ArrowRight className="size-[15px]" strokeWidth={2.25} />
                                </span>
                                <GradientCone variant="inverse" />
                            </button>

                            <div className="grid grid-cols-2 auto-rows-[160px] gap-3.5">
                                {filteredReports.slice(0, 3).map((item, index) => (
                                    <RowCard
                                        key={item.title}
                                        item={item}
                                        onOpenSetup={onOpenSetup}
                                        onOpenTemplates={onOpenTemplates}
                                        onToast={onToast}
                                        className={index === 0 ? "row-span-2" : ""}
                                        disabled={reportOpening && item.action === "report"}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="mb-11">
                        <div className="mb-4">
                            <h2 className="text-[17px] font-semibold tracking-[-0.01em]">
                                People &amp; membership
                            </h2>
                        </div>
                        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
                            {filteredPeople.map((item) => (
                                <TileCard
                                    key={item.title}
                                    item={item}
                                    onOpenSetup={onOpenSetup}
                                    onOpenTemplates={onOpenTemplates}
                                    onToast={onToast}
                                />
                            ))}
                        </div>
                    </section>

                    <section>
                        <div className="mb-4">
                            <h2 className="text-[17px] font-semibold tracking-[-0.01em]">Finance</h2>
                        </div>
                        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredFinance.map((item) => (
                                <TileCard
                                    key={item.title}
                                    item={item}
                                    onOpenSetup={onOpenSetup}
                                    onOpenTemplates={onOpenTemplates}
                                    onToast={onToast}
                                />
                            ))}
                        </div>
                    </section>
                </div>

                <aside className="flex flex-col gap-4 xl:sticky xl:top-[88px]">
                    <div className="rounded-[14px] border border-border bg-card p-5 text-card-foreground">
                        <h3 className="text-[14.5px] font-semibold">Continue where you left off</h3>

                        <div className="mt-3.5 flex flex-col">
                            {reportLoading ? (
                                <p className="py-2 text-sm text-muted-foreground">Checking unfinished items…</p>
                            ) : reportExists && !reportCompleted ? (
                                <button
                                    type="button"
                                    onClick={() => onOpenSetup()}
                                    disabled={reportOpening}
                                    aria-busy={reportOpening}
                                    className="-mx-2 flex items-center gap-3 rounded-[10px] px-2 py-2.5 text-left transition hover:bg-muted"
                                >
                                    <span className="grid size-[34px] shrink-0 place-items-center rounded-[9px] bg-primary/10 text-primary">
                                        <FileText className="size-[17px]" strokeWidth={1.75} />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="flex items-center gap-2 text-[13.5px] font-semibold">
                                            {reportPeriodLabel} report
                                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10.5px] font-semibold text-primary">
                                                {currentStatusLabel}
                                            </span>
                                        </span>
                                        <span className="mt-0.5 block text-xs text-muted-foreground">
                                            {resumeLabel} · {currentReport?.completion_percentage ?? 0}% complete
                                        </span>
                                    </span>
                                    <ChevronRight className="size-[15px] text-muted-foreground" />
                                </button>
                            ) : (
                                <p className="py-2 text-sm text-muted-foreground">No unfinished items yet.</p>
                            )}
                        </div>
                    </div>

                    <div className="rounded-[14px] border border-border bg-muted p-5">
                        <span className="mb-3.5 grid size-[38px] place-items-center rounded-[10px] bg-card text-foreground shadow-sm">
                            <BookOpen className="size-[19px]" strokeWidth={1.75} />
                        </span>
                        <h3 className="text-[14.5px] font-semibold">New to CFI Workspace?</h3>
                        <p className="mb-4 mt-1 text-[12.5px] leading-5 text-muted-foreground">
                            Explore short guides on reporting, membership, and finance workflows.
                        </p>
                        <button
                            type="button"
                            onClick={() => onToast("Opening help center…")}
                            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary"
                        >
                            Visit help center
                            <ArrowRight className="size-3.5" />
                        </button>
                    </div>
                </aside>
            </div>
        </main>
    )
}
