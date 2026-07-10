"use client"

import * as React from "react"
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    ColumnDef,
    SortingState,
    getExpandedRowModel,
} from "@tanstack/react-table"
import { useTableStyleSystem } from "../hooks/use-table-style"
import { DataTableVariant } from "../types/tableVariant.types"

import { buildColumns, ColumnMeta } from "../utils/buildColumns"
import { User } from "@/features/auth/schemas/user"


type TableConfig<T> = {
    columns: ColumnMeta<T>[]
    variant?: DataTableVariant
    footer?: {
        enabled?: boolean
        sumFields?: (keyof T)[]
    }
}

type UseTableEngineProps<T> = {
    data: T[]
    config?: TableConfig<T>
    user?: User
    expandable?: boolean
    enablePinning?: boolean
}

export function useTableEngine<T extends Record<string, unknown>>({
    data,
    config,
    user,
    expandable = false,
    enablePinning = false,
}: UseTableEngineProps<T>) {
    const safeConfig = React.useMemo(() => {
        return config ?? { columns: [] }
    }, [config])

    const normalizedColumns = React.useMemo(() => {
        const cols = safeConfig.columns ?? []

        // schema guard: remove invalid columns (prevents blank tables)
        return cols.filter(
            (c): c is ColumnMeta<T> =>
                !!c && typeof c.id === "string"
        )
    }, [safeConfig.columns])

    const columns = React.useMemo<ColumnDef<T>[]>(() => {
        return buildColumns<T>(normalizedColumns, user)
    }, [normalizedColumns, user])
    
    const [sorting, setSorting] = React.useState<SortingState>([])

    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
        data: Array.isArray(data) ? data : [],
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getExpandedRowModel: expandable ? getExpandedRowModel() : undefined,
        getRowCanExpand: expandable ? () => true : undefined,   
        columnResizeMode: "onChange",
        enableColumnPinning: enablePinning,
        initialState: {
            columnPinning: {
                left: enablePinning
                    ? normalizedColumns
                        .filter(c => c.pinned === "left")
                        .map(c => String(c.id))
                    : [],
                right: enablePinning
                    ? normalizedColumns
                        .filter(c => c.pinned === "right")
                        .map(c => String(c.id))
                    : [],
            },
        },
    })

    const interaction = safeConfig.variant?.interaction ?? {}

    const isEditable = !!interaction.editable
    const isSelectable = !!interaction.selectable

    const footer = React.useMemo(() => {
        if (!safeConfig.footer?.enabled) return null

        const result: Record<string, number> = {}

        safeConfig.footer.sumFields?.forEach((field) => {
            result[String(field)] = data.reduce((sum, row) => {
                const value = Number(row[field])
                return sum + (isNaN(value) ? 0 : value)
            }, 0)
        })

        return result
    }, [data, safeConfig.footer?.enabled, safeConfig.footer?.sumFields])

    // 🧠 6. UI VARIANT
    const variant = {
        mode: safeConfig.variant?.mode ?? "grid",
        border: safeConfig.variant?.border ?? "subtle",
        theme: safeConfig.variant?.theme ?? "neutral",
        interaction,
    }

    const styles = useTableStyleSystem(variant)

    return {
        table,
        columns,
        ui: variant,
        styles,        
        footer,
        interaction: {
            isEditable,
            isSelectable,
        },
    }
}
