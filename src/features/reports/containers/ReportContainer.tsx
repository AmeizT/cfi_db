"use client"

import React from "react"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core"
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { MonthlyReport } from "../schemas/report"
import { useReports } from "../hooks/use-reports"
import { Spinner } from "@/components/ui/spinner"
import { ReportFilters } from "../components/ReportFilters"
import { useSearchParams } from "next/navigation"
import { IconLayoutBoard, IconList } from "@tabler/icons-react"
import { eachMonthOfInterval, format, getYear, startOfYear } from "date-fns"
import { Separator } from "@/components/ui/separator"
import { ReportCard } from "../components/ReportCard"
import { ReportCardEmptyState } from "../components/ReportCardEmptyState"
import { PlaceholderReport } from "../types/placeholder-report"

interface Section {
    id: string
    title: string
    submitted: boolean
}

export function ReportContainer() {
    const searchParams = useSearchParams()

    const currentYear = getYear(new Date())
    const year = searchParams.get("year")
    const month = searchParams.get("month")
    const status = searchParams.get("status")
    const assembly = searchParams.get("assembly")
    const searchQuery = searchParams.get("q")

    const { data: reports = [], isLoading, isError } = useReports({ year })
    const yearValue = typeof year === "string" ? parseInt(year, 10) : currentYear

    // 🧠 State for view mode (list | board)
    const [viewMode, setViewMode] = React.useState<"list" | "board">("board")

    // 🗓️ Build all months up to current reporting month
    function getReportingMonth(date: Date) {
        // If day < 5, last month; else, this month.
        const d = new Date(date)
        if (d.getDate() < 5) {
            d.setMonth(d.getMonth() - 1)
        }
        return d.getMonth()
    }
    const now = new Date()
    const reportingMonth = getReportingMonth(now)
    const allMonths = eachMonthOfInterval({
        start: startOfYear(new Date(yearValue)),
        end: new Date(yearValue, reportingMonth, 1),
    })

    // 🧩 Ensure every month has a report (real or placeholder)
    const completeReports = allMonths.map((monthDate) => {
        const existingReport = reports.find(
            (r) =>
                new Date(r.period_start).getMonth() === monthDate.getMonth() &&
                new Date(r.period_start).getFullYear() === monthDate.getFullYear()
        )

        if (existingReport) return existingReport

        const placeholderReport: PlaceholderReport = {
            id: -1 * (monthDate.getFullYear() * 100 + monthDate.getMonth()),
            period_start: monthDate.toISOString(),
            status: "missing",
            data: { attendances: [], tithes: [], incomes: [], expenditures: [] },
            isPlaceholder: true,
        }

        return placeholderReport
    })

    // 🎯 Filter reports by user-selected filters
    const filteredReports = completeReports.filter((report: MonthlyReport | PlaceholderReport) => {
        const reportYear = new Date(report.period_start).getFullYear().toString()
        const reportMonth = (new Date(report.period_start).getMonth() + 1).toString()

        const selectedStatus = status || "all"
        const selectedYear = year || currentYear.toString()
        const selectedMonth = month || "all"
        const selectedAssembly = assembly || "all"
        const selectedSearch = searchQuery || ""

        const matchesStatus = selectedStatus === "all" || report.status === selectedStatus
        const matchesYear = selectedYear === "all" || reportYear === String(selectedYear)
        const matchesMonth = selectedMonth === "all" || reportMonth === String(selectedMonth)
        const matchesAssembly =
            selectedAssembly === "all" ||
            ("church" in report ? String(report.church) === selectedAssembly : true)
        const matchesSearch =
            selectedSearch === "" ||
            ("church" in report
                ? String(report.church).toLowerCase().includes(selectedSearch.toLowerCase())
                : true)

        return matchesStatus && matchesYear && matchesMonth && matchesAssembly && matchesSearch
    })

    // 🗂️ Group reports by status for the board view (and sort by month)
    const [boardColumns, setBoardColumns] = React.useState<{
        finalized: (MonthlyReport | PlaceholderReport)[]
        draft: (MonthlyReport | PlaceholderReport)[]
        missing: (MonthlyReport | PlaceholderReport)[]
    }>({ finalized: [], draft: [], missing: [] })

    // Memoize grouped and sorted reports by status
    const groupedReports = React.useMemo(() => {
        function sortByPeriod(a: MonthlyReport | PlaceholderReport, b: MonthlyReport | PlaceholderReport) {
            return new Date(a.period_start).getTime() - new Date(b.period_start).getTime()
        }
        const grouped = { finalized: [], draft: [], missing: [] } as {
            finalized: (MonthlyReport | PlaceholderReport)[]
            draft: (MonthlyReport | PlaceholderReport)[]
            missing: (MonthlyReport | PlaceholderReport)[]
        }
        for (const report of filteredReports) {
            const key = report.status === "finalized"
                ? "finalized"
                : report.status === "draft"
                    ? "draft"
                    : "missing"
            grouped[key].push(report)
        }
        grouped.finalized.sort(sortByPeriod)
        grouped.draft.sort(sortByPeriod)
        grouped.missing.sort(sortByPeriod)
        return grouped
    }, [filteredReports])

    // Only update setBoardColumns if the number of items in each column changes
    React.useEffect(() => {
        const prev = boardColumns
        const next = groupedReports
        const columns: (keyof typeof groupedReports)[] = ["finalized", "draft", "missing"]
        let changed = false
        for (const col of columns) {
            if ((prev[col]?.length ?? 0) !== (next[col]?.length ?? 0)) {
                changed = true
                break
            }
        }
        if (changed) {
            setBoardColumns(next)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupedReports])

    // 🧩 Helper: determine empty sections
    const getSections = (report: MonthlyReport | PlaceholderReport): Section[] => {
        const data = report.data || { attendances: [], tithes: [], incomes: [], expenditures: [] }
        return [
            { id: "attendance", title: "Attendance", submitted: data.attendances.length > 0 },
            { id: "tithes", title: "Tithes", submitted: data.tithes.length > 0 },
            { id: "incomes", title: "Incomes", submitted: data.incomes.length > 0 },
            { id: "expenditures", title: "Expenditures", submitted: data.expenditures.length > 0 },
        ]
    }

    const buttonStyles =
        "px-1.5 py-1 w-fit lg:w-full flex items-center justify-center gap-x-2 rounded-lg border border-gray-300 dark:border-neutral-700 shadow-xs text-sm font-semibold hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors [&>svg]:size-4.5"

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor)
    )

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (!over || !active) return
        // item id = `${status}:${report.id}`
        const [fromCol, fromId] = String(active.id).split(":")
        const [toCol, toId] = String(over.id).split(":")
        if (fromCol === toCol && fromId === toId) return
        if (!["finalized", "draft", "missing"].includes(fromCol) || !["finalized", "draft", "missing"].includes(toCol)) return
        // Move the report between columns
        setBoardColumns((prev) => {
            const itemIdx = prev[fromCol as keyof typeof prev].findIndex(r => String(r.id) === fromId)
            if (itemIdx === -1) return prev
            const item = prev[fromCol as keyof typeof prev][itemIdx]
            // Remove from old column
            const newFromArr = prev[fromCol as keyof typeof prev].filter((_, i) => i !== itemIdx)
            // Insert into new column at correct position (at drop index or at end)
            let insertIdx = prev[toCol as keyof typeof prev].findIndex(r => String(r.id) === toId)
            if (insertIdx === -1) insertIdx = prev[toCol as keyof typeof prev].length
            // Remove from target if already present (shouldn't happen, but for safety)
            let newToArr = prev[toCol as keyof typeof prev].filter(r => String(r.id) !== fromId)
            newToArr = [
                ...newToArr.slice(0, insertIdx),
                { ...item, status: toCol as "finalized" | "draft" | "missing" },
                ...newToArr.slice(insertIdx)
            ]
            return {
                ...prev,
                [fromCol]: newFromArr,
                [toCol]: newToArr,
            }
        })
    }

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center p-4">
                <Spinner />
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center p-4">
                <p className="text-red-500">Failed to load reports. Please try again.</p>
            </div>
        )
    }

    return (
        <div className="w-full grid grid-cols-[3fr_1fr] gap-6 mt-2">
            <section className="h-full">
                <div className="w-full h-fit flex flex-col lg:flex-row lg:justify-between items-center gap-2">
                    <ReportFilters statusQuery={status} yearQuery={year} monthQuery={month} />
                    <div className="w-full lg:w-fit flex items-center gap-2">
                        <button className={buttonStyles} onClick={() => setViewMode("list")}>
                            <IconList /> List
                        </button>
                        <button className={buttonStyles} onClick={() => setViewMode("board")}>
                            <IconLayoutBoard /> Board
                        </button>
                    </div>
                </div>

                {viewMode === "list" && (
                    <div className="w-full">
                        <div className="grid grid-cols-3 gap-2">
                            {filteredReports.map((report) =>
                                report?.isPlaceholder ? (
                                    <ReportCardEmptyState key={report.id} report={report} />
                                ) : (
                                    <ReportCard
                                        key={report.id}
                                        month={format(new Date(report.period_start), "MMMM")}
                                        status={report.status as "draft" | "finalized" | "missing"}
                                        isLoading={false}
                                        sections={getSections(report)}
                                    />
                                )
                            )}
                        </div>
                    </div>
                )}

                {viewMode === "board" && (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mt-6">
                            {(["finalized", "draft", "missing"] as const).map((statusKey) => {
                                const reportsForStatus = boardColumns[statusKey] || []
                                const title =
                                    statusKey === "finalized"
                                        ? "Finalized Reports"
                                        : statusKey === "draft"
                                            ? "Draft Reports"
                                            : "Missing Reports"
                                const bg =
                                    statusKey === "finalized"
                                        ? "bg-green-50"
                                        : statusKey === "draft"
                                            ? "bg-amber-50"
                                            : "bg-red-50"

                                return (
                                    <div
                                        key={statusKey}
                                        className={`min-h-[250px] h-fit p-2 rounded-2xl flex flex-col ${bg}`}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-lg font-semibold">{title}</h3>
                                            <span className="text-xs text-gray-500">{reportsForStatus.length}</span>
                                        </div>
                                        <SortableContext
                                            items={reportsForStatus.map((r) => `${statusKey}:${r.id}`)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            <div className="flex flex-col gap-2 min-h-[40px]">
                                                {reportsForStatus.length > 0 ? (
                                                    reportsForStatus.map((report) =>
                                                        report?.isPlaceholder ? (
                                                            <div
                                                                key={`${statusKey}:${report.id}`}
                                                                id={`${statusKey}:${report.id}`}
                                                                // Placeholders not draggable
                                                            >
                                                                <ReportCardEmptyState report={report} />
                                                            </div>
                                                        ) : (
                                                            <DraggableReportCard
                                                                key={`${statusKey}:${report.id}`}
                                                                id={`${statusKey}:${report.id}`}
                                                                report={report}
                                                                month={format(new Date(report.period_start), "MMMM")}
                                                                status={statusKey}
                                                                sections={getSections(report)}
                                                            />
                                                        )
                                                    )
                                                ) : (
                                                    <p className="text-sm text-gray-500 italic">No {title.toLowerCase()}.</p>
                                                )}
                                            </div>
                                        </SortableContext>
                                    </div>
                                )
                            })}
                        </div>
                    </DndContext>
                )}
            </section>
            <Separator orientation="vertical" className="hidden lg:block data-[orientation=vertical]:h-full bg-slate-200" />
            <aside></aside>
        </div>
    )
}





// const tableHeaders = [
//     { label: "Period", styles: "w-1/5 text-left" },
//     { label: "Assembly", styles: "text-left" },
//     { label: "Status", styles: "text-left" },
//     { label: "Compliance Tracking", styles: "w-1/3 text-left" },
//     { label: "Finalized At", styles: "text-left" },
//     { label: "Actions", styles: "text-left" },
// ]

{/* <div className="container mx-auto px-0 py-0">
    <div className="w-full overflow-x-auto">
        {!emptyState ? (
            <table className="w-full">
                <thead className="">
                    <tr className="h-10 border-b border-gray-200 dark:border-neutral-700">
                        {tableHeaders.map((header) => (
                            <th key={header.label} className={`px-3 ${header.styles} text-[12px] font-bold`}>
                                {header.label}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {filteredReports?.map((report) => {
                        const emptyDataTypes = getEmptyDataTypes(report)
                        console.log(emptyDataTypes)

                        const reportData = [
                            {
                                label: "Period",
                                value: `${format(new Date(report.period_start), "MMMM")}`,
                            },
                            { label: "Assembly", value: "Orwetoveni" },
                            {
                                label: "Status",
                                value: report?.status === "finalized" ? (
                                    <Badge className="pl-1.5 pr-2 py-1 w-fit rounded-lg flex gap-1 items-center bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                        <IconCircleCheckFilled className="size-4 mr-1" /> Finalized
                                    </Badge>
                                ) : (
                                    <Badge className="pl-1.5 pr-2 py-1 w-fit rounded-lg flex gap-1 items-center bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                        <IconCircleDotted className="size-4 mr-1" /> Draft
                                    </Badge>
                                ),
                            },
                        ]

                        const submissionStatus: { label: string; value: boolean }[] = [
                            {
                                label: "Attendance",
                                value: report?.data?.attendances?.length > 0,
                            },
                            {
                                label: "Expenditure",
                                value: report?.data?.expenditures?.length > 0,
                            },
                            {
                                label: "Income",
                                value: report?.data?.incomes?.length > 0,
                            },
                            {
                                label: "Tithes",
                                value: report?.data?.tithes?.length > 0,
                            },
                        ]

                        return (
                            <tr
                                key={report.id}
                                className="h-10 border-b border-gray-200 hover:bg-muted/25 transition-colors"
                            >
                                {reportData.map((item) => (
                                    <td key={item.label} className="px-3 text-left text-sm text-gray-600 first:font-semibold first:text-gray-800">
                                        {item.value}
                                    </td>
                                ))}

                                <td className="px-3">
                                    <div className="flex gap-1">
                                        {submissionStatus?.map((status) => {
                                            

                                            return (
                                                <div
                                                    key={status.label}
                                                    className={`pl-1.5 pr-2 h-6 flex justify-center items-center gap-1.5 text-xs font-medium ${status.value ? "text-green-800 bg-green-100 dark:bg-green-500/10 border-green-200" : "text-red-800 bg-red-100 dark:bg-red-500/10 border-red-200"} rounded-full border-0`}
                                                >
                                                    <span className="w-fit order-2">
                                                        {status.label}
                                                    </span>
                                                    <span
                                                        className={`size-3 order-1 rounded-full ${status.value ? "bg-green-500" : "bg-red-500"
                                                            }`}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </td>

                                <td>

                                </td>

                                <td className="px-3 text-center">
                                    <button className={`${buttonStyles} !w-fit !px-2 !py-0 h-7`}>
                                        Finalize
                                    </button>
                                    
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>) : (
            <div className="h-[60vh] flex flex-col justify-center items-center text-center">
                <div>
                    <IconFileDescription
                        strokeWidth={1.5}
                        className="size-8 mx-auto mb-4"
                    />

                    <h3 className="text-sm font-semibold mb-2">
                        No reports found
                    </h3>

                    <p className="text-muted-foreground mb-4 text-xs">
                        Adjust your filters or create a new report.
                    </p>

                    <Button className="px-2 py-1 h-9 rounded-lg font-semibold bg-primary">
                        <Plus className="size-4" />
                        Create Report
                    </Button>
                </div>
            </div>
        )}
    </div>
</div> */}




// Draggable wrapper for ReportCard
import { useDraggable } from "@dnd-kit/core"
type DraggableReportCardProps = {
    id: string
    report: MonthlyReport | PlaceholderReport
    month: string
    status: "finalized" | "draft" | "missing"
    sections: { id: string; title: string; submitted: boolean }[]
}
function DraggableReportCard({ id, report, month, status, sections }: DraggableReportCardProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id,
        disabled: !!report.isPlaceholder,
    })
    const style: React.CSSProperties = {
        transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
        opacity: isDragging ? 0.6 : 1,
        cursor: "grab",
        zIndex: isDragging ? 50 : undefined,
    }
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <ReportCard
                month={month}
                status={status}
                isLoading={false}
                sections={sections}
            />
        </div>
    )
}