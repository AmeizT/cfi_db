"use client"

import type { TableSchema } from "@/features/data-table/types/tableSchema.types"
import { DataTable } from "@/features/reports/core/components/DataTable"
import type { CumulativeTableRow } from "../types"

export function MonthlySummaryTable({
    rows,
    config,
}: {
    rows: CumulativeTableRow[]
    config?: TableSchema
}) {
    return (
        <DataTable
            data={rows}
            config={config}
            enableDelete={false}
            options={{ pagination: false }}
            showDefaultRowActions={false}
            showFilters={false}
            showRowActions={false}
            showToolbar={false}
        />
    )
}
