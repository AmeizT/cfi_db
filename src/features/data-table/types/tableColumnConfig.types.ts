// export type TableColumnConfig = {
//     id: string
//     label?: string
//     formatter?: "text" | "currency" | "date"
// }

type Formatter = "text" | "currency" | "date" | "percentage"

export type TableColumnConfig<T> = {
    id: keyof T
    label?: string
    formatter?: Formatter
    className?: string
    cellClassName?: string
    render?: (value: unknown, row: T) => React.ReactNode
}