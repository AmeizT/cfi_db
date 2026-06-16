"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import React from "react"
import { useState, useMemo } from "react"
import { useReports } from "../hooks/use-reports"
import {
    format,
    eachMonthOfInterval,
    startOfYear,
    endOfYear,
} from "date-fns"
import { ReportSummary } from "../types/report-summary"
import { MonthlyReport } from "../schemas/report"
import Link from "next/link"

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type ViewMode = "grouped" | "board" | "timeline"
type ReportStatus = "finalized" | "draft" | "missing"

interface ReportData {
    attendances: unknown[]
    tithes: unknown[]
    incomes: unknown[]
    expenditures: unknown[]
}

interface Report {
    id: number | string
    period_start: string
    status: ReportStatus
    data: ReportData
}

interface Section {
    id: string
    label: string
    done: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────────────────────

const GroupIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
)

const BoardIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="5" rx="1" /><rect x="3" y="11" width="7" height="10" rx="1" />
        <rect x="13" y="11" width="8" height="10" rx="1" />
    </svg>
)

const TimelineIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12" /><circle cx="6" cy="12" r="2.5" /><circle cx="12" cy="12" r="2.5" />
        <circle cx="18" cy="12" r="2.5" /><line x1="6" y1="5" x2="6" y2="9.5" /><line x1="12" y1="5" x2="12" y2="9.5" />
        <line x1="18" y1="5" x2="18" y2="9.5" />
    </svg>
)

const CheckIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
)

const XIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)

const PlusIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
)

const ChevronDown = ({ open }: { open: boolean }) => (
    <svg
        width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        className={`transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}
    >
        <polyline points="6 9 12 15 18 9" />
    </svg>
)

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
]

const BASE_YEAR = 2023

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getSections(report: Report): Section[] {
    const data = report.data ?? { attendances: [], tithes: [], incomes: [], expenditures: [] }
    return [
        { id: "attendance", label: "Attendance", done: data.attendances.length > 0 },
        { id: "tithes", label: "Tithes", done: data.tithes.length > 0 },
        { id: "incomes", label: "Incomes", done: data.incomes.length > 0 },
        { id: "expenditures", label: "Expenditures", done: data.expenditures.length > 0 },
    ]
}

function getProgress(report: Report): number {
    if (report.status === "missing") return 0
    const s = getSections(report)
    return Math.round((s.filter(x => x.done).length / s.length) * 100)
}

function SectionHoverCard({ sections, children }: { sections: Section[]; children: React.ReactNode }) {
    const [visible, setVisible] = useState(false)

    return (
        <div
            className="relative w-full"
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            {children}

            {visible && (
                <div
                    className="
            absolute z-50 bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2
            min-w-[180px] bg-white border border-[#ebe8e1] rounded-xl
            shadow-[0_8px_32px_rgba(0,0,0,0.12)] px-3.5 py-3 pointer-events-none
            animate-fadeUp
          "
                >
                    <p className="text-[11px] font-bold text-[#888] tracking-[0.08em] uppercase mb-2">
                        Sections
                    </p>

                    {sections.map(s => (
                        <div key={s.id} className="flex items-center gap-2 mb-1.5">
                            <div
                            className={`w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 ${s.done ? "bg-[#2d6a4f]" : "bg-[#f0ede7]"}`}>
                                {s.done ? <CheckIcon /> : <XIcon />}
                            </div>
                            <span
                                className={`text-xs ${s.done ? "font-semibold text-[#1a1a1a]" : "font-normal text-[#aaa]"}`}
                            >
                                {s.label}
                            </span>
                        </div>
                    ))}

                    {/* Arrow */}
                    <div
                        className="
              absolute -bottom-1.5 left-1/2 -translate-x-1/2 rotate-45
              w-2.5 h-2.5 bg-white border-r border-b border-[#ebe8e1]
            "
                    />
                </div>
            )}
        </div>
    )
}

const STATUS_STYLES: Record<ReportStatus, { badge: string; dot: string; bar: string }> = {
    finalized: {
        badge: "bg-[#d8f3dc] text-[#2d6a4f]",
        dot: "bg-[#40916c]",
        bar: "bg-gradient-to-r from-[#40916c] to-[#74c69d]",
    },
    draft: {
        badge: "bg-[#fff3cd] text-[#856404]",
        dot: "bg-[#f0a500]",
        bar: "bg-gradient-to-r from-[#f0a500] to-[#ffd166]",
    },
    missing: {
        badge: "bg-[#f0ede7] text-[#999]",
        dot: "bg-[#ccc]",
        bar: "bg-[#e0dbd3]",
    },
}

function ReportCard({ report, month }: { report: MonthlyReport; month: string }) {
    const isMissing = report.status === "missing"
    const progress = getProgress(report)
    const sections = isMissing ? [] : getSections(report)
    const styles = STATUS_STYLES[report.status]
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const createQueryString = React.useCallback(
        (updates: Record<string, string | null>) => {
            const params = new URLSearchParams(searchParams.toString())

            Object.entries(updates).forEach(([key, value]) => {
                if (value === null) {
                    params.delete(key)
                } else {
                    params.set(key, value)
                }
            })

            return params.toString()
        },
        [searchParams]
    )

    if (isMissing) {
        return (
            <div
                className="
          group border-2 border-dashed border-[#ddd] rounded-2xl px-4 py-5
          flex flex-col items-center justify-center gap-2 min-h-[130px] cursor-pointer
          hover:bg-[#faf9f7] hover:-translate-y-0.5 transition-all duration-200
        "
            >
                <div className="w-8 h-8 rounded-full border-2 border-dashed border-[#ddd] flex items-center justify-center text-[#ccc]">
                    <PlusIcon />
                </div>
                <span className="text-[13px] font-semibold text-[#ccc]">{month}</span>
                <span className="text-[10px] text-[#ddd] tracking-[0.05em] uppercase">No report</span>
            </div>
        )
    }

    

    return (
        <Link 
            key={report?.id}
            href={`${pathname}?${createQueryString({
                rid: String(report?.id), 
                mode: "details", tab: "attendance" 
            })}`}
        >
            <div className="bg-white border border-[#ebe8e1] rounded-2xl p-[18px] cursor-pointer min-h-[130px] hover:bg-[#faf9f7] hover:-translate-y-[3px] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-all duration-200">
                {/* Header */}
                <div className="flex items-center justify-between mb-3.5">
                    <span className="text-[15px] font-bold text-[#1a1a1a] tracking-tight">{month}</span>
                    <span
                        className={`
              text-[10px] font-bold tracking-[0.07em] uppercase px-2.5 py-1 rounded-full
              flex items-center gap-1.5 ${styles.badge}
            `}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
                        {report.status}
                    </span>
                </div>

                {/* Progress */}
                <div className="mb-2.5">
                    <div className="flex justify-between mb-1">
                        <span className="text-[10px] font-medium text-[#aaa] tracking-[0.05em] uppercase">
                            Progress
                        </span>
                        <span
                            className={`text-[11px] font-bold ${progress === 100 ? "text-[#2d6a4f]" : "text-[#555]"}`}
                        >
                            {progress}%
                        </span>
                    </div>
                    <div className="h-[5px] bg-[#f0ede7] rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${styles.bar}`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Section dots */}
                <div className="flex gap-[5px] mt-2.5">
                    {sections.map(s => (
                        <div
                            key={s.id}
                            title={s.label}
                            className={`
                w-[7px] h-[7px] rounded-full transition-colors duration-200
                ${s.done ? "bg-[#40916c]" : "bg-[#e0dbd3]"}
              `}
                        />
                    ))}
                </div>
            </div>
        </Link>
        
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// AccordionSection
// ─────────────────────────────────────────────────────────────────────────────

type StatusKey = "missing" | "draft" | "finalized"

const ACCORDION_STYLES: Record<StatusKey, { dot: string; badge: string; openBg: string }> = {
    missing: {
        dot: "bg-[#ccc]",
        badge: "bg-[#ccc]/20 text-[#aaa]",
        openBg: "bg-[#f7f5f2]",
    },
    draft: {
        dot: "bg-[#f0a500]",
        badge: "bg-[#f0a500]/15 text-[#f0a500]",
        openBg: "bg-[#fffbef]",
    },
    finalized: {
        dot: "bg-[#40916c]",
        badge: "bg-[#40916c]/15 text-[#40916c]",
        openBg: "bg-[#f0faf4]",
    },
}

function AccordionSection({
    label, count, statusKey, reports, defaultOpen = false,
}: {
    label: string
    count: number
    statusKey: StatusKey
    reports: MonthlyReport[] | ReportSummary []
    defaultOpen?: boolean
}) {
    const [open, setOpen] = useState(defaultOpen)
    const s = ACCORDION_STYLES[statusKey]

    return (
        <div className="rounded-2xl border border-[#ebe8e1] overflow-hidden bg-white">
            <button
                onClick={() => setOpen(o => !o)}
                className={`
          w-full px-5 py-4 flex items-center justify-between border-none cursor-pointer
          transition-colors duration-200 ${open ? s.openBg : "bg-white hover:bg-[#faf9f7]"}
        `}
            >
                <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                    <span className="text-sm font-bold text-[#1a1a1a] tracking-tight">{label}</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${s.badge}`}>
                        {count}
                    </span>
                </div>
                <ChevronDown open={open} />
            </button>

            {open && (
                <div className="px-5 py-4 border-t border-[#f0ede7]">
                    {reports.length === 0 ? (
                        <p className="text-[#bbb] text-[13px] text-center py-4">No reports in this category</p>
                    ) : (
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
                            {reports.map(r => (
                                <div
                                    key={r.id}
                                    
                                    
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// SummaryBox
// ─────────────────────────────────────────────────────────────────────────────

interface SummaryBoxProps {
    label: string
    count: number
    icon: string
    className: string
    valueClass: string
    labelClass: string
    iconClass: string
}

function SummaryBox({ label, count, icon, className, valueClass, labelClass, iconClass }: SummaryBoxProps) {
    return (
        <div
            className={`
        flex-1 rounded-2xl px-5 py-4 border cursor-default
        hover:-translate-y-0.5 transition-all duration-200
        ${className}
      `}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className={`text-[11px] font-bold tracking-[0.08em] uppercase mb-1.5 ${labelClass}`}>
                        {label}
                    </p>
                    <p className={`text-4xl font-extrabold tracking-[-0.04em] leading-none ${valueClass}`}>
                        {count}
                    </p>
                </div>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${iconClass}`}>
                    {icon}
                </div>
            </div>
        </div>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// YearButton — isolated so hover state uses React state cleanly
// ─────────────────────────────────────────────────────────────────────────────

function YearButton({
    year,
    isSelected,
    onClick,
}: {
    year: number
    isSelected: boolean
    onClick: () => void
}) {
    const [hovered, setHovered] = useState(false)
    const [pressed, setPressed] = useState(false)

    const scale = pressed ? 0.94 : hovered && !isSelected ? 1.08 : 1

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => { setHovered(false); setPressed(false) }}
            onMouseDown={() => setPressed(true)}
            onMouseUp={() => setPressed(false)}
            className={`
        block text-left w-full bg-transparent border-none cursor-pointer px-1.5 py-1 relative
        ${isSelected ? "text-[#1a1a1a]" : hovered ? "text-[#888]" : "text-[#ccc]"}
        ${isSelected ? "text-[26px] font-extrabold tracking-[-0.04em]" : "text-[20px] font-medium tracking-[-0.02em]"}
      `}
            style={{
                lineHeight: 1.1,
                transform: `scale(${scale})`,
                transformOrigin: "left center",
                transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1), color 0.15s ease, font-size 0.15s ease",
            }}
        >
            {year}
            {isSelected && (
                <span className="block w-[3px] h-[3px] rounded-full bg-[#1a1a1a] mt-[3px]" />
            )}
        </button>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// ReportsList — main export
// ─────────────────────────────────────────────────────────────────────────────

export function ReportsLister() {
    const [viewMode, setViewMode] = useState<ViewMode>("grouped")
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const currentYear = new Date().getFullYear()
    const periodParam = searchParams.get("period")
    const selectedYear = String(periodParam ?? currentYear)
    const viewParam = (searchParams.get("view") as ViewMode) ?? "grouped"
    const { data: reports = [], isLoading } = useReports({ year: selectedYear })

    console.log("reports", reports)

    const years = useMemo(
        () => Array.from({ length: currentYear - BASE_YEAR + 1 }, (_, i) => BASE_YEAR + i),
        [currentYear],
    )

    const groupedReports = useMemo(() => {
        const expectedMonths = eachMonthOfInterval({
            start: startOfYear(new Date(Number(selectedYear), 0)),
            end: endOfYear(new Date(Number(selectedYear), 0)),
        })

        const reportMap = new Map(
            reports.map((r) => [
                format(new Date(r.period_start), "yyyy-MM"),
                r,
            ])
        )

        const missing: ReportSummary[] = []
        const draft: (typeof reports)[number][] = []
        const finalized: (typeof reports)[number][] = []

        expectedMonths.forEach((monthDate) => {
            const key = format(monthDate, "yyyy-MM")
            const existing = reportMap.get(key)

            if (!existing) {
                missing.push({
                    id: `missing-${key}`,
                    period_start: String(monthDate),
                    status: "missing",
                })
            } else if (existing.status === "draft") {
                draft.push(existing)
            } else {
                finalized.push(existing)
            }
        })

        return { missing, draft, finalized }
    }, [reports, selectedYear])

    const views: { key: ViewMode; Icon: () => React.JSX.Element; label: string }[] = [
        { key: "grouped", Icon: GroupIcon, label: "Grouped" },
        { key: "board", Icon: BoardIcon, label: "Board" },
        { key: "timeline", Icon: TimelineIcon, label: "Timeline" },
    ]

    const createQueryString = React.useCallback(
        (updates: Record<string, string | null>) => {
            const params = new URLSearchParams(searchParams.toString())

            Object.entries(updates).forEach(([key, value]) => {
                if (value === null) {
                    params.delete(key)
                } else {
                    params.set(key, value)
                }
            })

            return params.toString()
        },
        [searchParams]
    )

    const handleYearChange = (year: number) => {
        router.push(pathname + '?' + createQueryString({ period: String(year) }))
    }

    const handleViewChange = (view: ViewMode) => {
        router.push(pathname + '?' + createQueryString({ view }))
    }

    return (
        <div className="flex gap-9 py-8 min-h-screen font-sans">

            {/* Keyframe for hover-card fade-up */}
            <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateX(-50%) translateY(6px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .animate-fadeUp { animation: fadeUp 0.18s ease both; }
      `}</style>
            <div className="w-40 sticky top-8 self-start h-fit">
                <p className="text-[9px] font-extrabold tracking-[0.12em] text-[#bbb] uppercase mb-4 pl-0.5">
                    Year
                </p>
                <ul className="flex flex-col gap-1 list-none">
                    {years.map(year => {
                        const isSelected = Number(selectedYear) === year

                        return (
                            <li key = {year}>
                                <YearButton
                                    year={year}
                                    isSelected={isSelected}
                                    onClick={() => handleYearChange(year)}  
                                />                             
                            </li>
                        )
                    })}
                </ul>
            </div>

            {/* ── Main Content ─────────────────────────────────────────────────── */}
            <div className="flex-1 min-w-0">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-[11px] font-bold text-[#aaa] tracking-widest uppercase mb-1">
                            Reports
                        </p>
                        <h1 className="text-[28px] font-extrabold text-[#1a1a1a] tracking-[-0.04em]">
                            {selectedYear}
                        </h1>
                    </div>

                    {/* View toggle */}
                    <div className="flex bg-white border border-[#ebe8e1] rounded-xl p-1 gap-0.5">
                        {views.map(({ key, Icon, label }) => (
                            <button
                                key={key}
                                onClick={() => setViewMode(key)}
                                title={label}
                                className={`px-3 py-[7px] rounded-[9px] border-none cursor-pointer flex items-center justify-center transition-all duration-150 ${viewMode === key ? "bg-[#1a1a1a] text-white" : "bg-transparent text-[#999] hover:text-[#555] hover:bg-[#f7f5f2]"}`}
                            >
                                <Icon />
                            </button>
                        ))}
                    </div>
                </div>

                {isLoading ? (
                    <div>
                        Loading...
                    </div>
                ) : (
                    <React.Fragment>
                        <div className="flex gap-3.5 mb-7">
                            <SummaryBox
                                label="Missing"
                                count={groupedReports.missing.length}
                                icon="○"
                                className="bg-[#f7f5f2] hover:bg-[#f0ede7] border-[#e5e0d8] hover:shadow-black/5 hover:shadow-md"
                                valueClass="text-[#555]"
                                labelClass="text-[#999]"
                                iconClass="bg-[#ede9e2] text-[#aaa]"
                            />
                            <SummaryBox
                                label="Draft"
                                count={groupedReports.draft.length}
                                icon="◐"
                                className="bg-[#fffbef] hover:bg-[#fff7dc] border-[#f5e8b0] hover:shadow-yellow-400/10 hover:shadow-md"
                                valueClass="text-[#856404]"
                                labelClass="text-[#b08800]"
                                iconClass="bg-[#fdf3c0] text-[#f0a500]"
                            />
                            <SummaryBox
                                label="Finalized"
                                count={groupedReports.finalized.length}
                                icon="●"
                                className="bg-[#f0faf4] hover:bg-[#e4f5ea] border-[#b7e4c7] hover:shadow-green-400/10 hover:shadow-md"
                                valueClass="text-[#2d6a4f]"
                                labelClass="text-[#40916c]"
                                iconClass="bg-[#d8f3dc] text-[#40916c]"
                            />
                        </div>

                        {viewMode === "grouped" && (
                            <div className="flex flex-col gap-3.5">
                                <AccordionSection
                                    label="Missing"
                                    count={groupedReports.missing.length}
                                    statusKey="missing"
                                    reports={groupedReports.missing}
                                    defaultOpen={false}
                                />
                                {/* <AccordionSection
                                    label="Draft"
                                    count={groupedReports.draft.length}
                                    statusKey="draft"
                                    reports={groupedReports.draft}
                                    defaultOpen={true}
                                />
                                <AccordionSection
                                    label="Finalized"
                                    count={groupedReports.finalized.length}
                                    statusKey="finalized"
                                    reports={groupedReports.finalized}
                                    defaultOpen={true}
                                /> */}
                            </div>
                        )}

                        {viewMode === "board" && (
                            <p className="text-center py-16 text-[#bbb] text-sm">Board view — coming soon</p>
                        )}

                        {viewMode === "timeline" && (
                            <p className="text-center py-16 text-[#bbb] text-sm">Timeline view — coming soon</p>
                        )}
                    </React.Fragment>
                )}
            </div>
        </div>
    )
}