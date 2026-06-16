type UploadError = {
    row: number
    field?: string
    message: string
}

type UploadErrorsPanelProps = {
    errors: UploadError[]
}

export function UploadErrorsPanel({ errors }: UploadErrorsPanelProps) {
    if (errors.length === 0) return null

    console.log(errors)

    return (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
            <h3 className="font-semibold text-red-700 mb-2">
                Errors found
            </h3>

            <ul className="text-sm space-y-1">
                {errors.map((e, i) => (
                    <li key={i}>
                        Row {e.row}: {e.message}
                    </li>
                ))}
            </ul>
        </div>
    )
}