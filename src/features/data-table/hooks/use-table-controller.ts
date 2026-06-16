import React from "react"

export function useTableController<T>() {
    const [selectedRows, setSelectedRows] = React.useState<Set<string | number>>(new Set())
    const [activeCell, setActiveCell] = React.useState<{ row: number; col: string } | null>(null)

    function toggleRow(id: string | number) {
        setSelectedRows(prev => {
            const copy = new Set(prev)
            copy.has(id) ? copy.delete(id) : copy.add(id)
            return copy
        })
    }

    return {
        selectedRows,
        toggleRow,
        activeCell,
        setActiveCell,
    }
}