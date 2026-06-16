import { useVirtualizer } from "@tanstack/react-virtual"
import { useRef } from "react"
import { Row } from "@tanstack/react-table"

export function useTableVirtualization<T>({
    rows,
    rowHeight = 36,
}: {
    rows: Row<T>[]
    rowHeight?: number
}) {
    "use no memo"
    const parentRef = useRef<HTMLDivElement>(null)
    
    // eslint-disable-next-line react-hooks/incompatible-library
    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => rowHeight,
        overscan: 10,
        // Add this — prevents crashes when ref isn't attached yet
        initialRect: { width: 0, height: 600 },
    })

    return {
        parentRef,
        rowVirtualizer,
    }
}