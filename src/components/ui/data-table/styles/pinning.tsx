import { type CSSProperties } from "react"
import { Column } from "@tanstack/react-table"

export function getPinningStyles<T>(
  column: Column<T>,
  isHeader = false
): CSSProperties {
  const isPinned = column.getIsPinned()

  return {
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    position: isPinned ? "sticky" : "relative",
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    width: column.getSize(),
    zIndex: isPinned ? (isHeader ? 10 : 1) : 0,
  }
}

