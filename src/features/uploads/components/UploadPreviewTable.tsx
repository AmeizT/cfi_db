import { cn } from "@/lib/utils"

type RowData = Record<string, unknown>

type UploadError = {
    row: number
    field?: string
    message: string
}

type UploadPreviewTableProps = {
    data: RowData[]
    errors: UploadError[]
    editable?: boolean
    disabled?: boolean
    onChange?: (rowIndex: number, field: string, value: string) => void
}

export function UploadPreviewTable({
    data,
    errors,
    editable = false,
    disabled = false,
    onChange,
}: UploadPreviewTableProps) {
    const errorMap = new Map()
    const rowErrorMap = new Map()

    errors.forEach((e) => {
        if (e.field) {
            errorMap.set(`${e.row}-${e.field}`, e.message)
        } else {
            rowErrorMap.set(e.row, e.message)
        }
    })

    const columns = Array.from(
        data.reduce((set, row) => {
            Object.keys(row).forEach((key) => set.add(key))
            return set
        }, new Set<string>())
    )

    return (
        <div className="overflow-auto border rounded-xl bg-background">
            <table className="w-full table-fixed text-sm">
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col} className="w-40 p-2 border-b text-left">
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {data.map((row, i) => (
                        <tr key={i}>
                            {columns.map((col) => {
                                const rowNumber = i + 2
                                const error = errorMap.get(`${rowNumber}-${col}`) ?? rowErrorMap.get(rowNumber)
                                const value = String(row[col] ?? "")

                                return (
                                    <td
                                        key={col}
                                        className={cn(
                                            "h-11 border p-1.5 align-top",
                                            error ? "bg-red-100 text-red-600" : ""
                                        )}
                                        title={error || ""}
                                    >
                                        {editable ? (
                                            <input
                                                aria-label={`${col} row ${i + 1}`}
                                                value={value}
                                                disabled={disabled}
                                                onChange={(event) => onChange?.(i, col, event.target.value)}
                                                className="h-8 w-full min-w-0 rounded-md border border-transparent bg-transparent px-2 text-sm outline-none focus:border-ring focus:bg-background disabled:cursor-not-allowed disabled:opacity-70"
                                            />
                                        ) : (
                                            value
                                        )}
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
