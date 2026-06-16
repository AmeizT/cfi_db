type UploadActionsProps = {
    onSubmit: () => void
    loading?: boolean
    disabled?: boolean
}

export function UploadActions({ onSubmit, loading = false, disabled = false }: UploadActionsProps) {
    return (
        <div className="flex gap-3">
            <button
                onClick={onSubmit}
                disabled={disabled || loading}
                className="px-4 py-2 bg-black text-white rounded-xl disabled:opacity-50"
            >
                {loading ? "Uploading..." : "Submit"}
            </button>
        </div>
    )
}