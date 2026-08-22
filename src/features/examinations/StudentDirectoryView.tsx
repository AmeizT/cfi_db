"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FileUploadIcon, ViewIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { SearchIcon } from "lucide-react"
import View from "@/components/ui/view"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NativeSelect } from "@/components/ui/native-select"
import { DataTable } from "@/features/reports/core/components/DataTable"
import type { DataTableAction } from "@/features/reports/core/components/DataTable.types"
import type { TableSchema } from "@/features/data-table/types/tableSchema.types"
import { useStudentSummaries } from "./hooks"
import type { StudentSummary } from "./types"

type Row = StudentSummary & {
    average_2024: string
    average_2025: string
    average_2026: string
    overall_average_display: string
}

const schema: TableSchema = {
    intent: "minimal",
    columns: [
        { id: "student_number", label: "Student number" },
        { id: "full_name", label: "Full name" },
        { id: "examinations_written", label: "Exams written", formatter: "number", align: "right" },
        { id: "average_2024", label: "2024 average", align: "right" },
        { id: "average_2025", label: "2025 average", align: "right" },
        { id: "average_2026", label: "2026 average", align: "right" },
        { id: "overall_average_display", label: "Overall average", align: "right" },
        { id: "final_grade", label: "Final grade", meta: { badge: true } },
    ],
    variant: { mode: "list", border: "y", theme: "neutral", interaction: { editable: false, selectable: false, density: "comfortable" } },
}

const displayAverage = (value: string | null) => value === null ? "—" : `${Number(value).toFixed(2)}%`

export function StudentDirectoryView() {
    const router = useRouter()
    const [page, setPage] = React.useState(1)
    const [pageSize, setPageSize] = React.useState(25)
    const [search, setSearch] = React.useState("")
    const [academicYear, setAcademicYear] = React.useState("")
    const [grade, setGrade] = React.useState("")
    const [resultFilter, setResultFilter] = React.useState("")
    const query = useStudentSummaries({
        page,
        page_size: pageSize,
        search,
        academic_year: academicYear,
        final_grade: grade,
        no_results: resultFilter === "none",
        incomplete: resultFilter === "incomplete",
    })
    const rows = React.useMemo<Row[]>(() => (query.data?.results ?? []).map((student) => ({
        ...student,
        average_2024: displayAverage(student.yearly_averages["2024"]),
        average_2025: displayAverage(student.yearly_averages["2025"]),
        average_2026: displayAverage(student.yearly_averages["2026"]),
        overall_average_display: displayAverage(student.overall_average),
        final_grade: student.final_grade ?? "—",
    })), [query.data])
    const actions = React.useCallback((row: Row): DataTableAction[] => [{
        label: "View transcript",
        icon: ViewIcon,
        variant: "default",
        onClick: () => router.push(`/students/examinations/${row.id}/transcript`),
    }], [router])
    const resetPage = (callback: () => void) => { setPage(1); callback() }

    return (
        <View>
            <View.Header
                pagename="Student examination results"
                actions={<Button asChild><Link href="/students/examinations/upload"><HugeiconsIcon icon={FileUploadIcon} /> Upload results PDF</Link></Button>}
            />
            <View.Body className="gap-4 py-4">
                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative min-w-64 flex-1 sm:max-w-sm">
                        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input className="pl-9" placeholder="Search student number or name" value={search} onChange={(event) => resetPage(() => setSearch(event.target.value))} />
                    </div>
                    <NativeSelect aria-label="Academic year" value={academicYear} onChange={(event) => resetPage(() => setAcademicYear(event.target.value))}>
                        <option value="">All academic years</option><option>2024</option><option>2025</option><option>2026</option>
                    </NativeSelect>
                    <NativeSelect aria-label="Final grade" value={grade} onChange={(event) => resetPage(() => setGrade(event.target.value))}>
                        <option value="">All final grades</option>{["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "D", "F"].map((value) => <option key={value}>{value}</option>)}
                    </NativeSelect>
                    <NativeSelect aria-label="Result completeness" value={resultFilter} onChange={(event) => resetPage(() => setResultFilter(event.target.value))}>
                        <option value="">All result states</option><option value="none">No results</option><option value="incomplete">Incomplete results</option>
                    </NativeSelect>
                </div>
                {query.isError ? (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">{query.error.message}</div>
                ) : (
                    <DataTable<Row>
                        data={rows}
                        config={schema}
                        isLoading={query.isLoading}
                        loadingMode="overlay"
                        showToolbar={false}
                        showDefaultRowActions={false}
                        rowActions={actions}
                        enableDelete={false}
                        resource="reports"
                        totalRows={query.data?.count ?? 0}
                        currentPage={page}
                        pageSize={pageSize}
                        onPageChange={setPage}
                        onPageSizeChange={(size) => { setPage(1); setPageSize(size) }}
                    />
                )}
            </View.Body>
        </View>
    )
}
