"use client"

import * as React from "react"
import View from "@/components/ui/view"
import { EmptyState } from "@/components/ui/empty-state"
import { DataTable } from "@/features/reports/core/components/DataTable"
import { RegionalDirectoryError } from "../components/RegionalDirectoryError"
import {
    RegionalDirectoryToolbar,
    type RegionalOrderingOption,
} from "../components/RegionalDirectoryToolbar"
import { regionalAssembliesTableSchema } from "../config/table-schemas"
import { useRegionalAssemblies } from "../hooks/use-regional-administration"
import { useRegionalDirectoryTableState } from "../hooks/use-regional-directory-table-state"
import type { RegionalAssembly } from "../types/regional-administration"

const ORDERING_OPTIONS: RegionalOrderingOption[] = [
    { label: "Assembly name", value: "name" },
    { label: "Assembly name descending", value: "-name" },
    { label: "Code", value: "code" },
    { label: "Zone", value: "zone__name" },
    { label: "Country", value: "country" },
    { label: "City", value: "city" },
    { label: "Status", value: "status" },
]

export function RegionalAssembliesView() {
    const tableState = useRegionalDirectoryTableState({
        defaultOrdering: "name",
    })
    const assembliesQuery = useRegionalAssemblies(tableState.queryParams)

    const rows = React.useMemo(
        () => assembliesQuery.data?.results ?? [],
        [assembliesQuery.data?.results]
    )
    const totalRows = assembliesQuery.data?.count ?? 0
    const tableSchema =
        assembliesQuery.data?.table_schemas?.churches ??
        assembliesQuery.data?.table_schema ??
        regionalAssembliesTableSchema
    const isLoading = assembliesQuery.isLoading || assembliesQuery.isFetching
    const emptyType = tableState.search ? "filteredReports" : "reports"

    return (
        <View className="gap-0">
            <View.Header
                pagename="Assemblies"
                description="Regional assemblies scoped to your assigned region."
            />

            <View.Body className="gap-4 py-4">
                <RegionalDirectoryToolbar
                    search={tableState.search}
                    ordering={tableState.ordering}
                    searchPlaceholder="Search assemblies"
                    orderingOptions={ORDERING_OPTIONS}
                    onSearchChange={tableState.onSearchChange}
                    onOrderingChange={tableState.onSortChange}
                />

                {assembliesQuery.isError ? (
                    <RegionalDirectoryError error={assembliesQuery.error} />
                ) : !isLoading && rows.length === 0 ? (
                    <div className="rounded-lg border bg-card px-6 py-12">
                        <EmptyState
                            type={emptyType}
                            variant="both"
                            context={{ label: "assemblies" }}
                        />
                    </div>
                ) : (
                    <DataTable<RegionalAssembly>
                        data={rows}
                        config={tableSchema}
                        isLoading={isLoading}
                        loadingMode="overlay"
                        showToolbar={false}
                        showRowActions={false}
                        enableDelete={false}
                        totalRows={totalRows}
                        currentPage={tableState.currentPage}
                        pageSize={tableState.pageSize}
                        pageSizeOptions={tableState.pageSizeOptions}
                        onPageChange={tableState.onPageChange}
                        onPageSizeChange={tableState.onPageSizeChange}
                    />
                )}
            </View.Body>
        </View>
    )
}
