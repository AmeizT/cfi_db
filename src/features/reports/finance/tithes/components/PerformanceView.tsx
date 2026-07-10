"use client"

import { DataTable } from "@/features/reports/core/components/DataTable"
import type { PerformanceResult } from "../types"
import { EmptyState } from "@/components/ui/empty-state";


export function PerformanceView({
    data,
    isLoading,
}: {
    data?: PerformanceResult
    isLoading: boolean
}) {
    if (isLoading) {
        return <div>Loading tithe performance...</div>
    }

    if (!data || data.response.target === null) {
        return (
            <EmptyState type="performance" />
        )
    }

    return (
        <DataTable
            data={data.rows}
            config={data.config}
            enableDelete={false}
            showDefaultRowActions={false}
            showFilters={false}
            showRowActions={false}
            showToolbar={false}
        />
    )
}
