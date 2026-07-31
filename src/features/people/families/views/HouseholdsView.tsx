"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"
import View from "@/components/ui/view"
import { EmptyState } from "@/components/ui/empty-state"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/features/reports/core/components/DataTable"
import type { TableSchema } from "@/features/data-table/types/tableSchema.types"
import { useHouseholds } from "../hooks"

const householdsTableSchema: TableSchema = {
    intent: "minimal",
    columns: [
        { id: "name", label: "Household" },
        { id: "head_of_household", label: "Head of Household" },
        { id: "active_member_count", label: "Members", formatter: "number" },
        { id: "location", label: "Location" },
        { id: "contact", label: "Contact" },
        { id: "status", label: "Status", meta: { badge: true } },
        { id: "created_at", label: "Created", formatter: "date" },
    ],
    variant: { mode: "list", border: "y", interaction: { selectable: false } },
}

export function HouseholdsView() {
    const [search, setSearch] = React.useState("")
    const [page, setPage] = React.useState(1)
    const [pageSize, setPageSize] = React.useState(10)
    const query = useHouseholds({ search, page, page_size: pageSize })
    const rows = query.data?.results ?? []
    return (
        <View className="gap-0">
            <View.Header
                pagename="Households"
            />

            <View.Body className="py-4">
                <div className="space-y-4">
                    <div className="relative max-w-sm">
                        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input className="pl-9" aria-label="Search households" placeholder="Search households" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} />
                    </div>
                    {query.isError ? (
                        <div className="rounded-lg border p-8 text-center text-sm text-destructive">Unable to load households.</div>
                    ) : !query.isLoading && rows.length === 0 ? (
                        <EmptyState type="households" />
                    ) : (
                        <DataTable
                            variant="simple"
                            data={rows}
                            config={(query.data?.table_schema as TableSchema | undefined) ?? householdsTableSchema}
                            isLoading={query.isLoading || query.isFetching}
                            loadingMode="overlay"
                            showToolbar={false}
                            showDefaultRowActions={false}
                            enableDelete={false}
                            resource="households"
                            totalRows={query.data?.count ?? 0}
                            currentPage={page}
                            pageSize={pageSize}
                            onPageChange={setPage}
                            onPageSizeChange={(size) => { setPageSize(size); setPage(1) }}
                        />
                    )}
                </div>
            </View.Body>
        </View>
    )
}
