// "use client"

// import * as React from "react"
// import {
//     ColumnDef,
//     getCoreRowModel,
//     getFilteredRowModel,
//     getSortedRowModel,
//     useReactTable,
//     SortingState,
//     flexRender,
// } from "@tanstack/react-table"

// import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader, TableFooter } from "@/components/ui/table"
// import { EditableCell } from "@/components/ui/editable-cell"
// // import { useDnDColumns } from "@/hooks/use-dnd-columns"
// import { useVirtualRows } from "@/hooks/use-virtualizer"
// import { SortableHeaderCell } from "@/components/ui/data-table/SortableHeaderCell"

// export interface TableTab {
//     id: string
//     label: string
//     pathname: string
// }

// type DataGridProps<T> = {
//     data: T[]
//     columns: ColumnDef<T>[]
//     rowHeight?: number
//     onCellEdit?: (rowIndex: number, columnId: keyof T, value: T[keyof T]) => void
//     onDeleteRows?: (ids: string[] | number[]) => void
//     footerData?: Record<string, number> // 👈 ADD THIS
//     onRowClick?: (row: T) => void
//     borderVariant?: {
//         outer?: boolean
//         inner?: boolean
//         header?: boolean
//         rows?: boolean
//         columns?: boolean
//     }
//     tableTabs?: TableTab[]
// }

// export function SuperDataGrid<T extends { id: string | number }>({
//     data,
//     columns: initialColumns,
//     rowHeight = 36,
//     onCellEdit,
//     onDeleteRows,
//     footerData,
//     onRowClick,
//     tableTabs,
//     borderVariant,
// }: DataGridProps<T>) {

//     const [sorting, setSorting] = React.useState<SortingState>([])
//     const [selectedRows, setSelectedRows] = React.useState<Set<string | number>>(new Set())
//     const [hoveredRowId, setHoveredRowId] = React.useState<string | number | null>(null)

//     // const { columns, DragContext } = useDnDColumns(
//     //     initialColumns.map((col, i) => ({
//     //         ...col,
//     //         id: col.id ?? String(col.header ?? i),
//     //     }))
//     // )

//     const columns = []

//     const { parentRef, rowVirtualizer } = useVirtualRows(data, rowHeight)

//     // eslint-disable-next-line react-hooks/incompatible-library
//     const table = useReactTable({
//         data,
//         columns,
//         state: { sorting },
//         onSortingChange: setSorting,
//         getCoreRowModel: getCoreRowModel(),
//         getFilteredRowModel: getFilteredRowModel(),
//         getSortedRowModel: getSortedRowModel(),
//         columnResizeMode: "onChange",
//     })

//     function toggleRow(id: string) {
//         setSelectedRows(prev => {
//             const copy = new Set(prev)
//             copy.has(id) ? copy.delete(id) : copy.add(id)
//             return copy
//         })
//     }

//     function toggleAll() {
//         if (selectedRows.size === data.length) {
//             setSelectedRows(new Set())
//         } else {
//             setSelectedRows(new Set(data.map(r => r.id)))
//         }
//     }

//     function deleteSelected() {
//         const ids = Array.from(selectedRows)
//         onDeleteRows?.(ids as string[] | number[])
//         setSelectedRows(new Set())
//     }

//     const showOuter = borderVariant?.outer
//     const showHeader = borderVariant?.header
//     const showRows = borderVariant?.rows || borderVariant?.inner
//     const showColumns = borderVariant?.columns || borderVariant?.inner

//     const CHECKBOX_COLUMN_WIDTH = 40

//     const cellRefs = React.useRef<Record<string, HTMLInputElement | null>>({})

//     function handleNavigate(
//         direction: "up" | "down" | "left" | "right",
//         rowIndex: number,
//         columnId: keyof T
//     ) {
//         const visibleColumns = table.getVisibleLeafColumns()
//         const colIndex = visibleColumns.findIndex(col => col.id === columnId)

//         let nextRow = rowIndex
//         let nextCol = colIndex

//         if (direction === "up") nextRow = Math.max(0, rowIndex - 1)
//         if (direction === "down") nextRow = Math.min(data.length - 1, rowIndex + 1)
//         if (direction === "left") nextCol = Math.max(0, colIndex - 1)
//         if (direction === "right") nextCol = Math.min(visibleColumns.length - 1, colIndex + 1)

//         const nextColumnId = visibleColumns[nextCol]?.id
//         const key = `${nextRow}-${nextColumnId}`

//         const el = cellRefs.current[key]
//         if (el) {
//             el.focus()
//         }
//     }

//     const hasTableTabs = !!tableTabs?.length

//     return (
//         <div className={`flex flex-col h-fit w-full overflow-auto bg-white rounded-none ${showOuter ? "border-y border-border-subtle" : ""}`}>
//             {/* {hasTableTabs ? (
//                 <div className="py-2 px-2 min-h-10 border-b border-border-subtle flex items-center justify-between">
//                     <ul className="flex items-center gap-2">
//                         {tableTabs?.map(tab => (
//                             <li key={tab.id}>
//                                 <Button asChild className="shadow-none capitalize text-mist-500 bg-mist-100 hover:bg-mist-200">
//                                     <Link href={tab.pathname}>
//                                         {tab.label}
//                                     </Link>
//                                 </Button>
//                             </li>
//                         ))}
//                     </ul>

//                     {selectedRows.size > 0 && (
//                         <div className="flex items-center justify-between text-sm">
//                             <Button
//                                 onClick={deleteSelected}
//                                 className="gap-0 shadow-none h-full text-red-500 bg-red-100 hover:bg-red-200"
//                             >
//                                 Delete&nbsp;<span>{`(${selectedRows.size})`} item{selectedRows.size !== 1 ? "s" : ""}</span>
//                             </Button>
//                         </div>
//                     )}
//                 </div>
//             ) : null} */}

//             <DragContext>
//                 <Table
//                     ref={parentRef}
//                     className="min-w-full table-fixed overflow-x-auto text-sm"
//                 >
//                     <TableHeader className={`${showHeader ? "border-b border-border-subtle" : ""} [&_tr]:border-b-0`}>
//                         <TableRow className="bg-neutral-100">
//                             <TableHead
//                                 className="border-b border-r border-border-subtle bg-mist-100 text-center text-xs font-medium text-neutral-500"
//                                 style={{
//                                     width: CHECKBOX_COLUMN_WIDTH,
//                                     minWidth: CHECKBOX_COLUMN_WIDTH,
//                                     maxWidth: CHECKBOX_COLUMN_WIDTH
//                                 }}
//                             >
//                                 {/* empty corner like Excel */}
//                             </TableHead>

//                             {table.getVisibleLeafColumns().map((column, index) => {
//                                 const letter = String.fromCharCode(65 + index) // A, B, C...
//                                 return (
//                                     <TableHead
//                                         key={column.id}
//                                         className="border-b border-r border-border-subtle bg-mist-100 text-center text-xs font-medium text-neutral-500"
//                                         style={{
//                                             width: column.getSize(),
//                                         }}
//                                     >
//                                         {letter}
//                                     </TableHead>
//                                 )
//                             })}
//                         </TableRow>
//                         <TableRow>
//                             <TableHead 
//                                 className="border-b border-r border-border-subtle bg-neutral-100" 
//                                 style={{ 
//                                     width: CHECKBOX_COLUMN_WIDTH, 
//                                     minWidth: CHECKBOX_COLUMN_WIDTH, 
//                                     maxWidth: CHECKBOX_COLUMN_WIDTH
//                                 }}>
//                                 {/* <AnimatedCheckbox
//                                     checked={selectedRows.size === data.length}
//                                     variant={undefined}
//                                     size={undefined}
//                                 /> */}
//                             </TableHead>

//                             {table.getHeaderGroups().map(headerGroup => (
//                                 <React.Fragment key={headerGroup.id}>
//                                     {headerGroup.headers.map((header) => {
//                                         return (
//                                             <SortableHeaderCell
//                                                 key={header.id}
//                                                 header={header}
//                                                 style={{ width: header.getSize() }}
//                                             />
//                                         )
//                                     })}
//                                 </React.Fragment>
//                             ))}
//                         </TableRow>
//                     </TableHeader>

//                     <TableBody>
//                         {rowVirtualizer.getVirtualItems().map(virtualRow => {
//                             const row = table.getRowModel().rows[virtualRow.index]
//                             if (!row) return null

//                             const rowData = row.original

//                             return (

//                                 <TableRow
//                                     key={row.id}
//                                     style={{ height: virtualRow.size }}
//                                     // onClick={() => onRowClick?.(rowData)}
//                                     onMouseEnter={() => setHoveredRowId(rowData.id)}
//                                     onMouseLeave={() => setHoveredRowId(null)}
//                                     className={`py-0.5 cursor-pointer ${showRows ? "border-b border-border-subtle" : "border-b-0"} ${selectedRows.has(rowData.id) ? "bg-mist-200" : ""}`}
//                                 >
//                                     <TableCell
//                                         className={`px-0 w-20 text-center bg-neutral-100 ${showColumns ? "border-r border-border-subtle" : ""}`}
//                                         style={{
//                                             width: CHECKBOX_COLUMN_WIDTH,
//                                             minWidth: CHECKBOX_COLUMN_WIDTH,
//                                             maxWidth: CHECKBOX_COLUMN_WIDTH
//                                         }}
//                                     >
//                                         { (hoveredRowId === rowData.id || selectedRows.size > 0) ? (
//                                             <div 
//                                                 className="flex justify-center items-center h-full w-full"
//                                                 onClick={(e) => {
//                                                     e.stopPropagation()
//                                                     toggleRow(String(rowData.id))
//                                                 }}
//                                             >
//                                                 <AnimatedCheckbox
//                                                     checked={selectedRows.has(rowData.id)}
//                                                     variant={undefined}
//                                                     size={undefined}
//                                                 />
//                                             </div>
//                                         ) : (
//                                             <span className="text-xs text-neutral-500 font-medium">
//                                                 {virtualRow.index + 1}
//                                             </span>
//                                         )}
//                                     </TableCell>

//                                     {row.getVisibleCells().map(cell => {
//                                         type K = keyof T
//                                         const visibleCells = row.getVisibleCells()
//                                         const index = visibleCells.indexOf(cell)
//                                         const isLastColumn = index === visibleCells.length - 1
                                        
//                                         const columnKey = cell.column.id as K
//                                         const value = cell.getValue<T[K]>()
                                        
//                                         return (
//                                             <TableCell
//                                                 key={cell.id}
//                                                 className={`px-1 py-0.75 ${showColumns && !isLastColumn ? "border-r border-border-subtle" : ""}`}
//                                                 style={{
//                                                     width: cell.column.getSize(),
//                                                 }}
//                                             >
//                                                 {cell.column.columnDef.cell
//                                                   ? flexRender(cell.column.columnDef.cell, cell.getContext())
//                                                   : (
//                                                     <EditableCell<T, K>
//                                                         value={value as ((string | number | readonly string[]) & T[keyof T]) | undefined}
//                                                         rowIndex={virtualRow.index}
//                                                         columnId={columnKey}
//                                                         onSave={onCellEdit!}
//                                                         onNavigate={handleNavigate}
                                                        
//                                                     />
//                                                   )
//                                                 }
//                                             </TableCell>
//                                         )
//                                     })}
//                                 </TableRow>
//                             )
//                         })}
//                     </TableBody>

//                     {footerData && (
//                         <TableFooter className="hidden border-t-0 bg-inherit">
//                             <TableRow>
//                                 <TableCell
//                                     colSpan={2}
//                                     className="font-semibold border-t border-border-subtle"
//                                 >
//                                     Total
//                                 </TableCell>

//                                 {table.getVisibleLeafColumns().slice(1).map((column, index) => {
//                                     const key = column.id
//                                     const isLastColumn = index === table.getVisibleLeafColumns().slice(1).length - 1
                                    
//                                     const isNumeric = (column.columnDef.meta as { isNumeric?: boolean } | undefined)?.isNumeric

//                                     return (
//                                         <TableCell
//                                             key={column.id}
//                                             className={`px-2 py-1 font-semibold ${showRows ? "border-t border-border-subtle" : ""} ${showColumns && !isLastColumn ? "border-r border-border-subtle" : ""} ${isNumeric ? "text-right" : "text-left"}`}
//                                         >
//                                             {footerData?.[key] !== undefined
//                                                 ? Number(footerData[key]).toLocaleString()
//                                                 : ""}
//                                         </TableCell>
//                                     )
//                                 })}
//                             </TableRow>
//                         </TableFooter>
//                     )}
//                 </Table>
//             </DragContext>

//         </div>
//     )
// }

// import { Label } from '@/components/ui/label'
// import {
//     Checkbox,
//     type CheckboxProps,
// } from '@/components/animate-ui/components/radix/checkbox'
// import { Button } from "@/components/ui/button"
// import Link from "next/link"

// interface AnimatedCheckboxProps {
//     checked: boolean | 'indeterminate'
//     variant: CheckboxProps['variant']
//     size: CheckboxProps['size'];
// }

// export const AnimatedCheckbox = ({
//     checked,
//     variant,
//     size
// }: AnimatedCheckboxProps) => {
//     const [isChecked, setIsChecked] = React.useState(checked ?? false);

//     React.useEffect(() => {
//         setIsChecked(checked);
//     }, [checked]);

//     return (
//         <Label className="flex items-center gap-x-3">
//             <Checkbox
//                 checked={isChecked}
//                 onCheckedChange={setIsChecked}
//                 variant={variant}
//                 size={size}
//             />
//         </Label>
//     )
// }