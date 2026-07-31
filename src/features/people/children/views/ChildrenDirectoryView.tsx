"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/features/reports/core/components/DataTable"
import type { TableSchema } from "@/features/data-table/types/tableSchema.types"
import { useChildrenDirectory } from "../hooks"

const childrenTableSchema: TableSchema = {
    intent: "minimal",
    columns: [
        { id: "full_name", label: "Child" },
        { id: "gender", label: "Gender" },
        { id: "age", label: "Age", formatter: "number" },
        { id: "guardian_name", label: "Guardian" },
        { id: "guardian_relationship", label: "Relationship" },
        { id: "membership_status", label: "Status", meta: { badge: true } },
        { id: "membersince", label: "Member Since", formatter: "date" },
    ],
    variant: { mode: "list", border: "y", interaction: { selectable: false } },
}

export function ChildrenDirectoryView() {
    const [search, setSearch] = React.useState("")
    const [page, setPage] = React.useState(1)
    const [pageSize, setPageSize] = React.useState(10)
    const query = useChildrenDirectory({ search, page, page_size: pageSize })
    const rows = query.data?.results ?? []

    return (
        <div className="space-y-4">
            <div className="relative max-w-sm">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    aria-label="Search children"
                    className="pl-9"
                    placeholder="Search children or guardians"
                    value={search}
                    onChange={(event) => { setSearch(event.target.value); setPage(1) }}
                />
            </div>

            {query.isError ? (
                <div className="rounded-lg border p-8 text-center text-sm text-destructive">Unable to load children.</div>
            ) : !query.isLoading && rows.length === 0 ? (
                <EmptyState type={search ? "filteredReports" : "demographics"} variant="both" context={{ label: "children" }} />
            ) : (
                <DataTable
                    variant="simple"
                    data={rows}
                    config={(query.data?.table_schema as TableSchema | undefined) ?? childrenTableSchema}
                    isLoading={query.isLoading || query.isFetching}
                    loadingMode="overlay"
                    showToolbar={false}
                    showDefaultRowActions={false}
                    enableDelete={false}
                    resource="members"
                    totalRows={query.data?.count ?? 0}
                    currentPage={page}
                    pageSize={pageSize}
                    onPageChange={setPage}
                    onPageSizeChange={(size) => { setPageSize(size); setPage(1) }}
                />
            )}
        </div>
    )
}
