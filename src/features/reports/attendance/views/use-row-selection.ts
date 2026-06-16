"use client"

import { useState } from "react"

/**
 * Hook to manage row selection with shift-click support.
 */
export function useRowSelection() {
    const [selected, setSelected] = useState<number[]>([])
    const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null)

    /**
     * Select a row. If shift is held, select the range from lastSelectedIndex to current index.
     */
    function selectRow(index: number, shiftKey = false) {
        if (shiftKey && lastSelectedIndex !== null) {
            const start = Math.min(lastSelectedIndex, index)
            const end = Math.max(lastSelectedIndex, index)
            const range = Array.from({ length: end - start + 1 }, (_, i) => start + i)
            const newSelected = Array.from(new Set([...selected, ...range]))
            setSelected(newSelected)
        } else {
            if (selected.includes(index)) {
                // toggle off
                setSelected(selected.filter((i) => i !== index))
            } else {
                setSelected([...selected, index])
            }
            setLastSelectedIndex(index)
        }
    }

    return { selected, selectRow, setSelected }
}