"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"
import View from "@/components/ui/view"
import { EmptyState } from "@/components/ui/empty-state"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/features/reports/core/components/DataTable"
import { useFormerMembers } from "../hooks"
import { formerMembersTableSchema } from "../table-schema"
import type { TableSchema } from "@/features/data-table/types/tableSchema.types"

export function FormerMembersView({ embedded = false }: { embedded?: boolean }) {
    const [search, setSearch] = React.useState("")
    const [page, setPage] = React.useState(1)
    const [pageSize, setPageSize] = React.useState(10)
    const query = useFormerMembers({ search, page, page_size: pageSize })
    const rows = query.data?.results ?? []

    return (
        <View className="gap-0">
            {!embedded ? <View.Header pagename="Former Members" /> : null}
            <View.Body className="py-4">
                <div className="mb-4 relative max-w-sm">
                    <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input className="pl-9" aria-label="Search former members" placeholder="Search former members" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} />
                </div>
                {query.isError ? (
                    <p className="text-sm text-destructive">Unable to load former members.</p>
                ) : !query.isLoading && rows.length === 0 ? (
                    <EmptyState type="formerMembers" />
                ) : (
                    <DataTable
                        variant="simple"
                        data={rows}
                        config={(query.data?.table_schema as TableSchema | undefined) ?? formerMembersTableSchema}
                        isLoading={query.isLoading || query.isFetching}
                        loadingMode="overlay"
                        showToolbar={false}
                        showDefaultRowActions={false}
                        enableDelete={false}
                        resource="formerMembers"
                        totalRows={query.data?.count ?? 0}
                        currentPage={page}
                        pageSize={pageSize}
                        onPageChange={setPage}
                        onPageSizeChange={(size) => { setPageSize(size); setPage(1) }}
                    />
                )}
            </View.Body>
        </View>
    )
}
