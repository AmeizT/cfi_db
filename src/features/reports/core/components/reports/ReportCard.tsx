// components/ReportCard.tsx
"use client";

import { useState } from "react"
import {
    STATUS_CONFIG,
    fmtShort,
    fmtDate,
    isCurrentMonth,
    getSparkValues,
} from "../../utils"

import { BalanceBar } from "./BalanceBar";
import { Sparkline } from "./Sparkline";
import { StatusBadge } from "./StatusBadge";
import { StatBox } from "./StatBox";
import { AssemblyReport } from "../../schemas/report/assembly.schema";
import { ReportStatus } from "../../types/status.type";
import { MONTHS, SHORT_MONTHS } from "../../constants/reports";
import Link from "next/link";
import { createQueryString } from "../../lib/create-query-string";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface ReportCardProps extends React.HTMLAttributes<HTMLDivElement> {
    report: AssemblyReport;
    /** Used to derive the trailing sparkline — pass the full list */
    allReports: AssemblyReport[];
    /** Staggered animation index */
    index: number;
}



export function ReportCard({ report, allReports, index, ...rest }: ReportCardProps) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [status, setStatus] = useState<ReportStatus>(report.status);

    const cfg = STATUS_CONFIG[status];
    const monthIdx = new Date(report.period_start + "T00:00:00").getMonth();
    const month = MONTHS[monthIdx];
    const shortMonth = SHORT_MONTHS[monthIdx];
    const year = report.period_start.slice(0, 4);

    const balance = report.income_total - report.expense_total;
    const hasData = report.attendance_total > 0 || report.income_total > 0;
    const isCurrent = isCurrentMonth(report);
    const sparkVals = getSparkValues(report, allReports);

    const ctaLabel =
        status === "finalized"
            ? "View Report →"
            : status === "draft"
                ? "Finalize →"
                : "Start Recording →";

    return (
        <Link href={`${pathname}?${createQueryString(searchParams, {
            report_id: String(report?.id), 
            detailed: "true", 
            tab: "attendance",
            sheet: "sunday" 
        })}`}>
            <div
                {...rest}
                className={cn(
                    "group relative overflow-hidden cursor-pointer bg-card hover:bg-card/80",
                    "min-h-70 flex flex-col gap-4 p-5 pb-4",
                    "transition-all duration-200 ease-out",
                    "hover:shadow-card transition relative z-0 hover:z-10",
                    rest.className
                )}
                suppressHydrationWarning
                style={{
                    animationName: "fadeUp",
                    animationDuration: "0.35s",
                    animationTimingFunction: "ease",
                    animationFillMode: "both",
                    animationDelay: `${index * 0.05}s`,
                }}
            >
                {/* ── Top accent bar (finalized / draft only) ── */}
                <div
                    className="absolute top-0 inset-x-0 h-0.5 opacity-60 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: cfg.accentBar || "transparent" }}
                />

                {/* ── Ghost month watermark ── */}
                <span
                    className={cn(
                        "pointer-events-none select-none absolute right-0 bottom-0 text-[52px] font-bold leading-none text-mist-100 group-hover:text-border/60 transition-colors duration-200"
                    )}
                    aria-hidden="true"
                    suppressHydrationWarning
                >
                    {shortMonth}
                </span>

                {/* ── Header: month + status ── */}
                <div className="flex justify-between items-start">
                    <div>
                        {isCurrent && (
                            <span className="inline-block mb-1.5 font-mono text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                                Current
                            </span>
                        )}
                        <h3 className="text-xl font-bold text-card-foreground leading-none tracking-tight">
                            {month}
                        </h3>
                        <p className="font-mono text-[10px] text-muted-foreground mt-0.5">{year}</p>
                    </div>

                    <StatusBadge status={status} onChange={setStatus} />
                </div>

                {/* ── Stats / empty state ── */}
                {hasData ? (
                    <div className="hidden">
                        <div className="grid grid-cols-3 gap-2">
                            <StatBox
                                label="Attendance"
                                value={report.attendance_total.toLocaleString()}
                            />
                            <StatBox
                                label="Tithes"
                                value={`$${fmtShort(report.tithe_total)}`}
                                colorClass="text-primary"
                            />
                            <StatBox
                                label="Balance"
                                value={`${balance >= 0 ? "+" : ""}$${fmtShort(Math.abs(balance))}`}
                                colorClass={balance >= 0 ? "text-primary" : "text-red-400"}
                            />
                        </div>

                        <BalanceBar revenue={report.income_total} expenses={report.expense_total} />
                    </div>
                ) : (
                    <div className="flex items-center gap-3 py-4">
                        <div className="flex-1 h-px bg-border" />
                        <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/40 whitespace-nowrap">
                            No data recorded
                        </span>
                        <div className="flex-1 h-px bg-border" />
                    </div>
                )}

                {/* ── Footer: finalized date + sparkline ── */}
                <div className="flex justify-between items-center mt-auto">
                    <p className="font-mono text-[9px] text-muted-foreground/50">
                        {status === "finalized" && report.finalized_at
                            ? `Finalized ${fmtDate(report.finalized_at)}`
                            : status === "draft"
                                ? "⚠ Awaiting finalization"
                                : "Not started"}
                    </p>

                    {sparkVals.length > 1 && <Sparkline values={sparkVals} />}
                </div>

                {/* ── Hover CTA overlay ── */}
                <div className="absolute bottom-0 inset-x-0 pt-8 px-5 pb-4 hidden _flex justify-end bg-linear-to-t from-card via-card/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    suppressHydrationWarning
                >
                    <button
                        className={`
                        rounded-lg px-3.5 py-1.5 text-xs font-bold tracking-wide
                        transition-colors duration-150
                        ${status === "finalized"
                            ? "border border-primary/30 text-primary bg-transparent hover:bg-primary/10"
                            : "bg-primary text-primary-foreground hover:bg-primary/90"
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {ctaLabel}
                    </button>
                </div>
            </div>
        </Link>
        
    )
}
