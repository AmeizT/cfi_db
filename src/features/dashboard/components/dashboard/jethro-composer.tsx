"use client"

import {
    JethroComposer as SharedJethroComposer,
    type JethroComposerVariant,
} from "@/features/jethro/components/JethroComposer"

/** Compatibility wrapper for legacy dashboard imports. */
export function JethroComposer({
    value,
    onChange,
    onSubmit,
    placeholder,
    compactTools = false,
    loading = false,
    variant,
    className,
}: {
    value: string
    onChange: (value: string) => void
    onSubmit: () => void
    placeholder?: string
    compactTools?: boolean
    loading?: boolean
    variant?: JethroComposerVariant
    className?: string
}) {
    return (
        <SharedJethroComposer
            value={value}
            onChange={onChange}
            onSubmit={onSubmit}
            placeholder={placeholder}
            loading={loading}
            variant={variant ?? (compactTools ? "compact" : "relaxed")}
            className={className}
        />
    )
}
