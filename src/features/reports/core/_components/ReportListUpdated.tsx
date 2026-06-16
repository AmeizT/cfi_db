import { useState, useMemo } from "react"
import { MonthlyReport } from "../schemas/report";
import { useReports } from "../hooks/use-reports";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    format,
    eachMonthOfInterval,
    startOfYear,
    endOfYear,
} from "date-fns"
import React from "react";
import { ReportSummary } from "../types/report-summary";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const BASE_YEAR = 2023;

function getSections(report: MonthlyReport) {
    const data = report.data || { attendances: [], tithes: [], incomes: [], expenditures: [] };
    return [
        { id: "attendance", label: "Attendance", done: data.attendances.length > 0 },
        { id: "tithes", label: "Tithes", done: data.tithes.length > 0 },
        { id: "incomes", label: "Incomes", done: data.incomes.length > 0 },
        { id: "expenditures", label: "Expenditures", done: data.expenditures.length > 0 },
    ];
}

function getProgress(report: MonthlyReport) {
    if (report.status === "missing") return 0;
    const s = getSections(report);
    return Math.round((s.filter(x => x.done).length / s.length) * 100);
}

export interface ReportData {
    attendances: unknown[];
    tithes: unknown[];
    incomes: unknown[];
    expenditures: unknown[];
}

export interface Report {
    id: number | string;
    period_start: string;
    status: ReportStatus;
    data: ReportData;
}

export interface SectionItem {
    id: string;
    label: string;
    done: boolean;
}

interface SectionHoverCardProps {
    sections: SectionItem[];
    children: React.ReactNode;
}



function SectionHoverCard({ sections, children }: SectionHoverCardProps) {
    const [visible, setVisible] = useState(false);
    return (
        <div style={{ position: "relative", display: "inline-block", width: "100%" }}
            onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
            {children}
            {visible && (
                <div style={{
                    position: "absolute", bottom: "calc(100% + 10px)", left: "50%",
                    transform: "translateX(-50%)", zIndex: 50, minWidth: 180,
                    background: "#fff", border: "1px solid #ebe8e1",
                    borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                    padding: "12px 14px", pointerEvents: "none",
                    animation: "fadeUp 0.18s ease",
                }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                        Sections
                    </div>
                    {sections.map(s => (
                        <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                            <div style={{
                                width: 18, height: 18, borderRadius: "50%",
                                background: s.done ? "#2d6a4f" : "#f0ede7",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                flexShrink: 0,
                            }}>
                                {s.done ? "C" : "U"}
                            </div>
                            <span style={{ fontSize: 12, color: s.done ? "#1a1a1a" : "#aaa", fontWeight: s.done ? 600 : 400 }}>
                                {s.label}
                            </span>
                        </div>
                    ))}
                    {/* arrow */}
                    <div style={{
                        position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%) rotate(45deg)",
                        width: 11, height: 11, background: "#fff",
                        borderRight: "1px solid #ebe8e1", borderBottom: "1px solid #ebe8e1",
                    }} />
                </div>
            )}
        </div>
    );
}

export type ReportStatus = "missing" | "draft" | "finalized";

interface ReportCardProps {
    report: MonthlyReport
    month: string
}

function ReportCard({ report, month }: ReportCardProps) {
    const [hovered, setHovered] = useState(false);
    const isMissing = report.status === "missing";
    const progress = getProgress(report);
    const sections = isMissing ? [] : getSections(report);

    const statusColor: Record<ReportStatus, { bg: string; text: string; dot: string }> = {
        finalized: { bg: "#d8f3dc", text: "#2d6a4f", dot: "#40916c" },
        draft: { bg: "#fff3cd", text: "#856404", dot: "#f0a500" },
        missing: { bg: "#f0ede7", text: "#999", dot: "#ccc" },
    }
    const currentColor = statusColor[report.status];

    if (isMissing) {
        return (
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    border: "2px dashed #ddd",
                    borderRadius: 16, padding: "20px 18px",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    gap: 8, minHeight: 130, cursor: "pointer",
                    background: hovered ? "#faf9f7" : "transparent",
                    transform: hovered ? "translateY(-2px)" : "none",
                    transition: "all 0.22s ease",
                    color: "#bbb",
                }}
            >
                <div style={{ width: 32, height: 32, borderRadius: "50%", border: "2px dashed #ddd", display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc" }}>
                    Plus
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#ccc" }}>{month}</div>
                <div style={{ fontSize: 10, color: "#ddd", letterSpacing: "0.05em", textTransform: "uppercase" }}>No report</div>
            </div>
        );
    }

    return (
        <SectionHoverCard sections={sections}>
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    background: hovered ? "#faf9f7" : "#fff",
                    border: "1px solid #ebe8e1",
                    borderRadius: 16, padding: "18px",
                    cursor: "pointer", minHeight: 130,
                    transform: hovered ? "translateY(-3px)" : "none",
                    boxShadow: hovered ? "0 12px 28px rgba(0,0,0,0.08)" : "0 1px 4px rgba(0,0,0,0.04)",
                    transition: "all 0.22s ease",
                }}
            >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.02em" }}>{month}</span>
                    <span style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: "0.07em",
                        textTransform: "uppercase", padding: "3px 9px", borderRadius: 20,
                        background: currentColor.bg, color: currentColor.text,
                        display: "flex", alignItems: "center", gap: 5,
                    }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: currentColor.dot, display: "inline-block" }} />
                        {report.status}
                    </span>
                </div>

                {/* Progress bar */}
                <div style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: 10, color: "#aaa", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>Progress</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: progress === 100 ? "#2d6a4f" : "#555" }}>{progress}%</span>
                    </div>
                    <div style={{ height: 5, background: "#f0ede7", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{
                            height: "100%", borderRadius: 99,
                            width: `${progress}%`,
                            background: progress === 100 ? "linear-gradient(90deg, #40916c, #74c69d)" : "linear-gradient(90deg, #f0a500, #ffd166)",
                            transition: "width 0.6s ease",
                        }} />
                    </div>
                </div>

                {/* Dots */}
                <div style={{ display: "flex", gap: 5, marginTop: 10 }}>
                    {sections.map(s => (
                        <div key={s.id} title={s.label} style={{
                            width: 7, height: 7, borderRadius: "50%",
                            background: s.done ? "#40916c" : "#e0dbd3",
                            transition: "background 0.2s",
                        }} />
                    ))}
                </div>
            </div>
        </SectionHoverCard>
    );
}

interface AccordionSectionProps {
    label: string;
    count: number;
    statusKey: ReportStatus;
    reports: MonthlyReport[] | ReportSummary[];
    defaultOpen?: boolean;
}

function AccordionSection({ label, count, statusKey, reports, defaultOpen = false }: AccordionSectionProps) {
    const [open, setOpen] = useState(defaultOpen);
    const colors = {
        missing: { accent: "#ccc", bg: "#f7f5f2" },
        draft: { accent: "#f0a500", bg: "#fffbef" },
        finalized: { accent: "#40916c", bg: "#f0faf4" },
    }[statusKey];

    return (
        <div style={{ borderRadius: 16, border: "1px solid #ebe8e1", overflow: "hidden", background: "#fff" }}>
            <button
                onClick={() => setOpen(o => !o)}
                style={{
                    width: "100%", padding: "16px 20px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: open ? colors.bg : "#fff",
                    border: "none", cursor: "pointer",
                    transition: "background 0.2s",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors.accent }} />
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.01em" }}>{label}</span>
                    <span style={{
                        fontSize: 11, fontWeight: 700, padding: "2px 8px",
                        borderRadius: 99, background: colors.accent + "22", color: colors.accent,
                    }}>{count}</span>
                </div>
                chevron
            </button>

            {open && (
                <div style={{ padding: "16px 20px", borderTop: "1px solid #f0ede7" }}>
                    {reports.length === 0
                        ? <div style={{ color: "#bbb", fontSize: 13, textAlign: "center", padding: "16px 0" }}>No reports in this category</div>
                        : (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
                                {reports.map(r => (
                                    // <ReportCard 
                                    // key={r.id} 
                                    // report={r} 
                                    // month={MONTHS[new Date(r?.period_start).getMonth()]} />
                                    <div key={r.id}>report</div>
                                ))}
                            </div>
                        )
                    }
                </div>
            )}
        </div>
    );
}


interface SummaryBoxColor {
    bg: string;
    bgHover: string;
    border: string;
    label: string;
    value: string;
    iconBg: string;
    iconColor: string;
    shadow: string;
}

interface SummaryBoxProps {
    label: string;
    count: number;
    color: SummaryBoxColor;
    icon: React.ReactNode;
}

function SummaryBox({ label, count, color, icon }: SummaryBoxProps) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                flex: 1, borderRadius: 16, padding: "18px 22px",
                background: hovered ? color.bgHover : color.bg,
                border: `1px solid ${color.border}`,
                transform: hovered ? "translateY(-2px)" : "none",
                boxShadow: hovered ? `0 8px 24px ${color.shadow}` : "none",
                transition: "all 0.22s ease", cursor: "default",
            }}
        >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: color.label, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
                    <div style={{ fontSize: 36, fontWeight: 800, color: color.value, letterSpacing: "-0.04em", lineHeight: 1 }}>{count}</div>
                </div>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: color.iconBg, display: "flex", alignItems: "center", justifyContent: "center", color: color.iconColor, fontSize: 18 }}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

export default function ReportsListUpdated() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const currentYear = new Date().getFullYear()
    const periodParam = searchParams.get("period")
    const selectedYear = String(periodParam ?? currentYear)
    const [viewMode, setViewMode] = useState("grouped");
    const [pressedYear, setPressedYear] = useState<number | null>(null);
    const { data: reports = [], isLoading } = useReports({
        year: selectedYear,
    })

    const years = useMemo(() =>
        Array.from({ length: currentYear - BASE_YEAR + 1 }, (_, i) => BASE_YEAR + i),
        [currentYear]
    );

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
            const draft: MonthlyReport[] = []
            const finalized: MonthlyReport[] = []
    
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
                    // draft.push(existing)
                } else {
                    // finalized.push(existing)
                }
            })
    
            return { missing, draft, finalized }
        }, [reports, selectedYear])

    const views = [
        { key: "grouped", Icon: "", label: "Grouped" },
        { key: "board", Icon: "", label: "Board" },
        { key: "timeline", Icon: "", label: "Timeline" },
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

    return (
        <div className="flex">
            <div className="w-60 sticky top-8 h-fit" style={{ alignSelf: "flex-start" }}>
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", color: "#bbb", textTransform: "uppercase", marginBottom: 16, paddingLeft: 2 }}>Year</div>
                <ul className="flex flex-col gap-1">
                    {years.map((year) => {
                        const isSelected = Number(selectedYear) === year
                        const isPressed = pressedYear === year

                        return (
                            <li key={year}>
                                <button
                                    onMouseDown={() => setPressedYear(year)}
                                    onMouseUp={() => setPressedYear(null)}
                                    onMouseLeave={() => setPressedYear(null)}
                                    onClick={() => handleYearChange(year)}
                                    className={`
            w-full text-left block px-1.5 py-1
            transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]
            ${isSelected ? "text-[26px] font-extrabold text-[#1a1a1a] tracking-[-0.04em]"
                                            : "text-[20px] font-medium text-gray-400 tracking-[-0.02em]"}
            ${isPressed ? "scale-95" : "scale-100"}
          `}
                                >
                                    {year}

                                    {isSelected && (
                                        <span className="mt-1 block h-[3px] w-[3px] rounded-full bg-[#1a1a1a]" />
                                    )}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </div>

            {/* ── Main Content ── */}
            <div className="hidden min-w-0 _flex flex-1">

                {/* Header row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                    <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Reports</div>
                        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.04em" }}>{selectedYear}</h1>
                    </div>

                    {/* View Toggle */}
                    <div style={{ display: "flex", background: "#fff", border: "1px solid #ebe8e1", borderRadius: 12, padding: 4, gap: 2 }}>
                        {views.map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => setViewMode(key)}
                                title={label}
                                style={{
                                    padding: "7px 12px", borderRadius: 9, border: "none", cursor: "pointer",
                                    background: viewMode === key ? "#1a1a1a" : "transparent",
                                    color: viewMode === key ? "#fff" : "#999",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    transition: "all 0.18s ease",
                                }}
                            >
                                icon
                            </button>
                        ))}
                    </div>
                </div>

                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <React.Fragment>
                        <div style={{ display: "flex", gap: 14, marginBottom: 28 }}>
                            <SummaryBox
                                label="Missing" count={groupedReports.missing.length}
                                icon="○"
                                color={{ bg: "#f7f5f2", bgHover: "#f0ede7", border: "#e5e0d8", label: "#999", value: "#555", iconBg: "#ede9e2", iconColor: "#aaa", shadow: "rgba(0,0,0,0.06)" }}
                            />
                            <SummaryBox
                                label="Draft" count={groupedReports.draft.length}
                                icon="◐"
                                color={{ bg: "#fffbef", bgHover: "#fff7dc", border: "#f5e8b0", label: "#b08800", value: "#856404", iconBg: "#fdf3c0", iconColor: "#f0a500", shadow: "rgba(240,165,0,0.12)" }}
                            />
                            <SummaryBox
                                label="Finalized" count={groupedReports.finalized.length}
                                icon="●"
                                color={{ bg: "#f0faf4", bgHover: "#e4f5ea", border: "#b7e4c7", label: "#40916c", value: "#2d6a4f", iconBg: "#d8f3dc", iconColor: "#40916c", shadow: "rgba(64,145,108,0.12)" }}
                            />
                        </div>

                        {viewMode === "grouped" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                <AccordionSection label="Missing" count={groupedReports.missing.length} statusKey="missing" reports={groupedReports.missing} defaultOpen={false} />
                                <AccordionSection label="Draft" count={groupedReports.draft.length} statusKey="draft" reports={groupedReports.draft} defaultOpen={true} />
                                <AccordionSection label="Finalized" count={groupedReports.finalized.length} statusKey="finalized" reports={groupedReports.finalized} defaultOpen={true} />
                            </div>
                        )}

                        {viewMode === "board" && (
                            <div style={{ textAlign: "center", padding: "60px 0", color: "#bbb", fontSize: 14 }}>
                                Board view — coming soon
                            </div>
                        )}

                        {viewMode === "timeline" && (
                            <div style={{ textAlign: "center", padding: "60px 0", color: "#bbb", fontSize: 14 }}>
                                Timeline view — coming soon
                            </div>
                        )}
                    </React.Fragment>
                )}
            </div>
        </div>
    )
}