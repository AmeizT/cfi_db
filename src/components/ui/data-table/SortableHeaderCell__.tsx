import { CSS } from "@dnd-kit/utilities"
import { useSortable } from "@dnd-kit/sortable"
import { TableHead } from "@/components/ui/table"
import { HugeiconsIcon } from "@hugeicons/react"
import { DragDropVerticalIcon } from "@hugeicons/core-free-icons"
import { Header, flexRender, ColumnMeta } from "@tanstack/react-table"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Separator } from "../separator";
import { getPinningStyles } from "./styles/pinning";

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

  const isNumeric =
    (header.column.columnDef.meta as CustomColumnMeta | undefined)?.isNumeric

  const sorted = header.column.getIsSorted()

  const isPinned = header.column.getIsPinned()

  return (
    <TableHead
      ref={setNodeRef}
      style={{
        width: header.getSize(),
        ...combinedStyle,
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
        isNumeric ? "justify-end text-right w-full" : "justify-start text-left w-full"
      )}>
        <span
          {...attributes}
          {...listeners}
          className="hidden cursor-grab text-muted-foreground"
          onClick={(e) => e.stopPropagation()}
        >
          <HugeiconsIcon icon={DragDropVerticalIcon} className="size-4 text-muted" />
        </span>

        {/* ✅ Clickable sorting area */}
        <div
          className={cn(
            "flex flex-wrap items-center gap-2 cursor-pointer whitespace-normal wrap-break-word text-xs leading-tight w-full text-right", 
            isNumeric ? "justify-end" : "justify-start"
          )}
          onClick={header.column.getToggleSortingHandler()}
        >
          <Separator 
            orientation="vertical" 
            className="data-[orientation=vertical]:h-4 bg-border" 
          />

          {flexRender(header.column.columnDef.header, header.getContext())}

          {/* ✅ Sorting indicator */}
          {sorted === "asc" && " ↑"}
          {sorted === "desc" && " ↓"}
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

        {/* Resize handle */}
        <div
          onMouseDown={header.getResizeHandler()}
          className="absolute right-0 top-0 h-full w-1 cursor-col-resize"
        />
      </div>
    </TableHead>
  )
}