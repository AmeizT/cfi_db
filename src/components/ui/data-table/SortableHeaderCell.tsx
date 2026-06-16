import { CSS } from "@dnd-kit/utilities"
import { useSortable } from "@dnd-kit/sortable"
import { TableHead } from "@/components/ui/table"
import { HugeiconsIcon } from "@hugeicons/react"
import { DragDropVerticalIcon } from "@hugeicons/core-free-icons"
import { Header, flexRender, ColumnMeta } from "@tanstack/react-table"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  ArrowLeftToLineIcon,
  ArrowRightToLineIcon,
  EllipsisIcon,
  PinOffIcon,
} from "lucide-react"
import { getPinningStyles } from "./styles/pinning"

interface CustomColumnMeta extends ColumnMeta<unknown, unknown> {
    tooltip?: string
    isNumeric?: boolean
}

type SortableHeaderCellProps<T> = {
    header: Header<T, unknown>
} & React.HTMLAttributes<HTMLTableCellElement>

export function SortableHeaderCell<T>({
    header,
    style,
    className,
    ...rest
}: SortableHeaderCellProps<T>) {

    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: header.id })

    const combinedStyle = {
        transform: transform ? CSS.Transform.toString(transform) : undefined,
        transition,
        ...style,
    }

    const tooltipText = (header.column.columnDef.meta as CustomColumnMeta | undefined)?.tooltip
    const isNumeric = (header.column.columnDef.meta as CustomColumnMeta | undefined)?.isNumeric

    const sorted = header.column.getIsSorted()
    const isPinned = header.column.getIsPinned()

    return (
        <TableHead
            ref={setNodeRef}
            data-pinned={isPinned || undefined}
            style={{
                width: header.getSize(),
                ...getPinningStyles(header.column),
            }}
            className={cn(
                "px-3 font-medium select-none relative",
                "bg-muted/50",
                "data-pinned:bg-muted/90",
                "data-pinned:backdrop-blur-sm",
                className
            )}
            {...rest}
        >
            <div className={cn(
                "flex flex-wrap items-center gap-1",
                isNumeric ? "justify-end text-right w-full" : "justify-start text-left w-full")}
            >
                <span
                    {...attributes}
                    {...listeners}
                    className="cursor-grab text-muted-foreground"
                    onClick={(e) => e.stopPropagation()}
                >
                    <HugeiconsIcon icon={DragDropVerticalIcon} className="size-4 text-muted" />
                </span>

                <div 
                    className={cn(
                        "flex flex-wrap items-center gap-2 cursor-pointer whitespace-normal wrap-break-word text-xs leading-tight w-full text-right", 
                        isNumeric ? "justify-end" : "justify-start"
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                >

                    {flexRender(header.column.columnDef.header, header.getContext())}
                
                    {/* ✅ Sorting indicator */}
                    {sorted === "asc" && " ↑"}
                    {sorted === "desc" && " ↓"}


                      {!header.isPlaceholder &&
                        header.column.getCanPin() &&
                        (header.column.getIsPinned() ? (
                          <Button
                            aria-label={`Unpin ${header.column.columnDef.header as string} column`}
                            className="-mr-1 size-7 shadow-none"
                            onClick={() => header.column.pin(false)}
                            size="icon"
                            title={`Unpin ${header.column.columnDef.header as string} column`}
                            variant="ghost"
                          >
                            <PinOffIcon
                              aria-hidden="true"
                              className="opacity-60"
                              size={16}
                            />
                          </Button>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                aria-label={`Pin options for ${header.column.columnDef.header as string} column`}
                                className="-mr-1 size-7 shadow-none"
                                size="icon"
                                title={`Pin options for ${header.column.columnDef.header as string} column`}
                                variant="ghost"
                              >
                                <EllipsisIcon
                                  aria-hidden="true"
                                  className="opacity-60"
                                  size={16}
                                />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => header.column.pin("left")}
                              >
                                <ArrowLeftToLineIcon
                                  aria-hidden="true"
                                  className="opacity-60"
                                  size={16}
                                />
                                Stick to left
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => header.column.pin("right")}
                              >
                                <ArrowRightToLineIcon
                                  aria-hidden="true"
                                  className="opacity-60"
                                  size={16}
                                />
                                Stick to right
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ))}

                    </div>

                    {/* ✅ Tooltip */}
                    {tooltipText && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                        <span className="text-muted-foreground cursor-help text-xs">ⓘ</span>
                        </TooltipTrigger>
                        <TooltipContent>{tooltipText}</TooltipContent>
                    </Tooltip>
                    )}
                <div
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    onDoubleClick={() => header.column.resetSize()}
                    className="absolute top-0 -right-2 h-full w-4 cursor-col-resize touch-none select-none z-20 flex justify-center before:absolute before:inset-y-0 before:w-px before:bg-border"
                />
            </div>
        </TableHead>
    )
}