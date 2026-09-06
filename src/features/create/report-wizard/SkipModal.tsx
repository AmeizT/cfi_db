"use client"

import { useEffect, useState } from "react"

type SkipModalProps = {
    open: boolean
    onClose: () => void
    onConfirm: (reason: string) => void
}

export function SkipModal({ open, onClose, onConfirm }: SkipModalProps) {
    const [reason, setReason] = useState("")

    useEffect(() => {
        // Reset the optional reason each time this legacy prototype modal opens.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (open) setReason("")
    }, [open])

    if (!open) return null

    return (
        <div className="fixed inset-0 z-[200] grid place-items-center bg-foreground/45 p-5">
            <div className="w-full max-w-[420px] rounded-[14px] bg-card p-[26px] text-card-foreground shadow-xl">
                <h2 className="text-[17px] font-bold">Skip variable expenses?</h2>
                <p className="mb-4 mt-1.5 text-[13.5px] leading-[1.5] text-muted-foreground">
                    This section is optional, but you must log a reason before skipping. The report can still be submitted.
                </p>

                <textarea
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    placeholder="e.g. No variable expenses were incurred this month."
                    className="min-h-[90px] w-full resize-y rounded-[10px] border border-input bg-background px-3.5 py-3 text-[13.5px] outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/10"
                />

                <div className="mt-[18px] flex justify-end gap-2.5">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-[10px] border border-border bg-card px-4 py-2.5 text-[13.5px] font-semibold text-card-foreground transition hover:border-primary/40 hover:text-foreground"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            const trimmed = reason.trim()
                            if (!trimmed) return
                            onConfirm(trimmed)
                        }}
                        className="rounded-[11px] bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
                    >
                        Confirm skip
                    </button>
                </div>
            </div>
        </div>
    )
}
