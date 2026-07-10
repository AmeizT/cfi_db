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
import { regionalUsersTableSchema } from "../config/table-schemas"
import { useRegionalUsers } from "../hooks/use-regional-administration"
import { useRegionalDirectoryTableState } from "../hooks/use-regional-directory-table-state"
import type { RegionalUser } from "../types/regional-administration"

const ORDERING_OPTIONS: RegionalOrderingOption[] = [
    { label: "Name", value: "last_name" },
    { label: "Name descending", value: "-last_name" },
    { label: "Email", value: "email" },
    { label: "Assembly", value: "church__name" },
    { label: "Zone", value: "church__zone__name" },
    { label: "Country", value: "church__country" },
    { label: "Last active", value: "-last_active" },
]

export function RegionalUsersView() {
    const tableState = useRegionalDirectoryTableState({
        defaultOrdering: "last_name",
    })
    const usersQuery = useRegionalUsers(tableState.queryParams)

    const rows = React.useMemo(
        () => usersQuery.data?.results ?? [],
        [usersQuery.data?.results]
    )
    const totalRows = usersQuery.data?.count ?? 0
    const tableSchema =
        usersQuery.data?.table_schemas?.users ??
        usersQuery.data?.table_schema ??
        regionalUsersTableSchema
    const isLoading = usersQuery.isLoading || usersQuery.isFetching
    const emptyType = tableState.search ? "filteredReports" : "reports"

    return (
        <View className="gap-0">
            <View.Header
                pagename="Users"
                description="Users registered through assemblies in your assigned region."
            />

            <View.Body className="gap-4 py-4">
                <RegionalDirectoryToolbar
                    search={tableState.search}
                    ordering={tableState.ordering}
                    searchPlaceholder="Search users"
                    orderingOptions={ORDERING_OPTIONS}
                    onSearchChange={tableState.onSearchChange}
                    onOrderingChange={tableState.onSortChange}
                />

                {usersQuery.isError ? (
                    <RegionalDirectoryError error={usersQuery.error} />
                ) : !isLoading && rows.length === 0 ? (
                    <div className="rounded-lg border bg-card px-6 py-12">
                        <EmptyState
                            type={emptyType}
                            variant="both"
                            context={{ label: "users" }}
                        />
                    </div>
                ) : (
                    <DataTable<RegionalUser>
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
