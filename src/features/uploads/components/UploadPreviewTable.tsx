type RowData = Record<string, unknown>

type UploadError = {
    row: number
    field: string
    message: string
}

type UploadPreviewTableProps = {
    data: RowData[]
    errors: UploadError[]
}

export function UploadPreviewTable({ data, errors }: UploadPreviewTableProps) {
    const errorMap = new Map()

    errors.forEach((e) => {
        errorMap.set(`${e.row}-${e.field}`, e.message)
    })

    const columns = Object.keys(data[0] || {})

    return (
        <div className="overflow-auto border rounded-xl">
            <table className="w-full text-sm">
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col} className="p-2 border-b text-left">
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {data.map((row, i) => (
                        <tr key={i}>
                            {columns.map((col) => {
                                const error = errorMap.get(`${i + 2}-${col}`)

                                return (
                                    <td
                                        key={col}
                                        className={`p-2 border ${error ? "bg-red-100 text-red-600" : ""
                                            }`}
                                        title={error || ""}
                                    >
                                        {String(row[col])}
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