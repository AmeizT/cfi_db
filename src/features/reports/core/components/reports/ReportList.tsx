"use client"

import { useState, useMemo } from "react"
import { FilterTabs } from "./FilterTabs"
import { ReportCard } from "./ReportCard"
import { fmtCurrency } from "../../utils"
import { useSearchParams } from "next/navigation"
import { useReports } from "../../hooks/use-reports"
import { ReportStatus } from "../../types/status.type"
import { cn } from "@/lib/utils"
import View from "@/components/ui/view"
import { EmptyState } from "@/components/ui/empty-state"
import { parsePeriod } from "@/layouts/navigation/helpers/parse-period"

type FilterKey = "all" | ReportStatus

export function ReportList() {
    const searchParams = useSearchParams()
    const [filter, setFilter] = useState<FilterKey>("all");
    const period = parsePeriod(searchParams.get("period") || "")
    const year = String(period?.type === "year" ? period.value : undefined)
    const { data: REPORTS } = useReports({ year })

    const counts = useMemo(() => (
        {
            finalized: REPORTS?.filter((r) => r.status === "finalized").length ?? 0,
            draft: REPORTS?.filter((r) => r.status === "draft").length ?? 0,
            reviewed: REPORTS?.filter((r) => r.status === "reviewed").length ?? 0,
            approved: REPORTS?.filter((r) => r.status === "approved").length ?? 0,
            archived: REPORTS?.filter((r) => r.status === "archived").length ?? 0,
        }),
        
        [REPORTS],
    )

    const filtered = useMemo(
        () => (filter === "all" ? REPORTS : REPORTS?.filter((r) => r.status === filter)),
        [filter, REPORTS],
    );

    // const totalRevenue = useMemo(
    //     () => REPORTS?.filter((r) => r.status === "finalized").reduce((s, r) => s + r.income_total, 0) ?? 0,
    //     [REPORTS],
    // );

    // const totalAttendance = useMemo(
    //     () => REPORTS?.filter((r) => r.status === "finalized").reduce((s, r) => s + r.attendance_total, 0) ?? 0,
    //     [REPORTS],
    // )

    const emptyState = (filtered?.length ?? 0) === 0

    return (
        <View>
            <View.Header pagename={`Reports: ${year}`} pathname="" className="gap-6">
                <div
                    className="hidden _flex flex-wrap justify-between items-end gap-4"
                    style={{
                        animationName: "fadeUp",
                        animationDuration: "0.3s",
                        animationFillMode: "both"
                    }}
                >
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span
                                className="w-1.5 h-1.5 rounded-full bg-primary"
                                style={{ boxShadow: "0 0 6px var(--color-primary)" }}
                            />
                            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
                                {year} Reports
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Monthly Reports
                        </h1>
                    </div>

                    <div className="text-right">
                        <p className="font-mono text-[10px] text-muted-foreground mb-1">Finalized YTD</p>
                        <p className="text-lg font-bold text-primary">
                            {/* {fmtCurrency(totalRevenue)} revenue · {totalAttendance.toLocaleString()} attended */}
                        </p>
                    </div>
                </div>

                <FilterTabs
                    active={filter}
                    counts={counts}
                    total={REPORTS?.length || 0}
                    onChange={setFilter}
                />
            </View.Header>

            <View.Body>
                <div className={cn(
                    "flex-1 flex flex-col gap-6",
                    emptyState ? "justify-center" : ""
                )}>
                    {!emptyState ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0.75">
                            {/* {filtered?.map((report, index) => (
                                <ReportCard
                                    key={report.id}
                                    report={report}
                                    allReports={REPORTS ?? []}
                                    index={index}
                                    
                                />
                            ))} */}
                        </div>
                    ) : (
                        <EmptyState type={"filteredReports"} />
                    )}
                </div>
            </View.Body>
        </View>
    )
}
