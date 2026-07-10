import { Button } from "@/components/ui/button"

type UploadActionsProps = {
    onSubmit: () => void
    loading?: boolean
    disabled?: boolean
    submitLabel?: string
    loadingLabel?: string
    secondaryLabel?: string
    onSecondary?: () => void
    secondaryDisabled?: boolean
}

export function UploadActions({
    onSubmit,
    loading = false,
    disabled = false,
    submitLabel = "Submit",
    loadingLabel = "Uploading...",
    secondaryLabel,
    onSecondary,
    secondaryDisabled = false,
}: UploadActionsProps) {
    return (
        <div className="flex gap-3">
            <Button
                onClick={onSubmit}
                disabled={disabled || loading}
            >
                {loading ? loadingLabel : submitLabel}
            </Button>

            {onSecondary && secondaryLabel && (
                <Button
                    variant="secondary"
                    onClick={onSecondary}
                    disabled={secondaryDisabled || loading}
                >
                    {secondaryLabel}
                </Button>
            )}
        </div>
    )
}
