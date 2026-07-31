// @/components/ui/data-table/DataTableHead.tsx
"use client"

import React from "react"
import { flexRender, Header } from "@tanstack/react-table"
import { TableHead } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    ArrowLeftToLineIcon,
    ArrowRightToLineIcon,
    EllipsisIcon,
    PinOffIcon,
} from "lucide-react"
import { getPinningStyles } from "@/components/ui/data-table/styles/pinning"

export function renderDataTableHead<T>(
    header: Header<T, unknown>,
    enablePinning: boolean,
    leftPinnedOffset = 0
) {
    const { column } = header
    const isPinned = column.getIsPinned()
    const isLastLeftPinned = isPinned === "left" && column.getIsLastColumn("left")
    const isFirstRightPinned = isPinned === "right" && column.getIsFirstColumn("right")
    const headerLabel = header.column.columnDef.header as string
    const isNumeric = Boolean(
        (header.column.columnDef.meta as { isNumeric?: boolean } | undefined)?.isNumeric
    )

    const isLastColumn = header.index === header.headerGroup.headers.length - 1

    return (
        <TableHead
            key={header.id}
            className={[
                "relative h-9 truncate border-b",
                "data-pinned:bg-muted/90 data-pinned:backdrop-blur-xs",
                "[&:not([data-pinned]):has(+[data-pinned])_div.cursor-col-resize:last-child]:opacity-0",
                "[&[data-last-col=left]_div.cursor-col-resize:last-child]:opacity-0",
                "[&[data-pinned=left][data-last-col=left]]:border-r",
                "[&[data-pinned=right]:last-child_div.cursor-col-resize:last-child]:opacity-0",
                "[&[data-pinned=right][data-last-col=right]]:border-l",
                "[&[data-pinned][data-last-col]]:border-border",
            ]
                .filter(Boolean)
                .join(" ")}
            colSpan={header.colSpan}
            data-last-col={
                isLastLeftPinned ? "left" : isFirstRightPinned ? "right" : undefined
            }
            data-pinned={isPinned || undefined}
            style={{ ...getPinningStyles(column, true, leftPinnedOffset) }}
        >
            <div className="flex items-center justify-between gap-2">
                <span
                    className={[
                        "truncate flex-1",
                        isNumeric ? "text-right" : "text-left",
                    ].join(" ")}
                >
                    {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                </span>

                {/* Pin / Unpin controls — only when pinning is enabled */}
                {enablePinning && !header.isPlaceholder && column.getCanPin() && (
                    column.getIsPinned() ? (
                        <Button
                            aria-label={`Unpin ${headerLabel} column`}
                            className="-mr-1 size-7 shadow-none"
                            onClick={() => column.pin(false)}
                            size="icon"
                            title={`Unpin column`}
                            variant="ghost"
                        >
                            <PinOffIcon aria-hidden="true" className="opacity-60" size={16} />
                        </Button>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    aria-label={`Pin options for ${headerLabel} column`}
                                    className="-mr-1 size-7 shadow-none"
                                    size="icon"
                                    title={`Column Pin Options`}
                                    variant="ghost"
                                >
                                    <EllipsisIcon aria-hidden="true" className="opacity-60" size={16} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => column.pin("left")}>
                                    <ArrowLeftToLineIcon aria-hidden="true" className="opacity-60" size={16} />
                                    Stick to left
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => column.pin("right")}>
                                    <ArrowRightToLineIcon aria-hidden="true" className="opacity-60" size={16} />
                                    Stick to right
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )
                )}

                {column.getCanResize() && !isLastColumn && (
                    <div
                        data-resize-handle=""
                        className="
                            absolute right-0 top-1/2 z-20
                            h-1/2 w-4
                            translate-x-1/2 -translate-y-1/2
                            cursor-col-resize select-none touch-none
                            opacity-0 transition-opacity
                            group-hover/resizer:opacity-100

                            before:absolute
                            before:inset-y-0
                            before:left-1/2
                            before:w-0.75
                            before:-translate-x-1/2
                            before:rounded-0
                            before:bg-border/80
                            before:transition-[width,background-color]

                            hover:before:w-1
                            hover:before:bg-theme-500

                        "
                        onDoubleClick={() => column.resetSize()}
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                    />
                )}
            </div>
        </TableHead>
    )
}
