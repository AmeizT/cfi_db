"use client"
import { useVirtualizer } from "@tanstack/react-virtual"
import { useRef } from "react"

export function useVirtualRows<T>(data: T[], rowHeight: number = 36) {
    const parentRef = useRef<HTMLTableElement>(null)

    // eslint-disable-next-line react-hooks/incompatible-library
    const rowVirtualizer = useVirtualizer({
        count: data.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => rowHeight,
        overscan: 10,
    })

    return { parentRef, rowVirtualizer }
}