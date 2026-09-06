"use client"

import * as React from "react"
import { Loader2Icon } from "lucide-react"
import type { ApiDetailRouteKey } from "@/config/urls"
import type { TableColumnConfig } from "@/features/data-table/types/tableSchema.types"
import { updateCell } from "@/features/reports/core/actions/cell-edit"
import { optimisticUpdateRecord } from "@/helpers/optistimicUpdate"
import { useOptimisticMutation } from "@/hooks/use-optimistic-mutation"
import { cn } from "@/lib/utils"

type EditableCellProps<T, K extends keyof T> = Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "type"
> & {
    value: T[K] | undefined
    columnId: K
    resource: ApiDetailRouteKey
    recordId: number
    autoFocus?: boolean
    displayValue?: React.ReactNode
    editor?: TableColumnConfig["editor"]
    queryKey?: readonly unknown[]
}

// Kept for existing report query factories that share these stable key parts.
export const queryKeys = {
    attendance: (reportId: string) => ["attendance", reportId] as const,
}

function editorValue(value: unknown, editorType: NonNullable<TableColumnConfig["editor"]>["type"]) {
    if (value == null) return ""
    if (editorType === "date") return String(value).slice(0, 10)
    return String(value)
}

export function EditableCell<T, K extends keyof T>({
    value: initialValue,
    recordId,
    columnId,
    autoFocus = false,
    displayValue,
    resource,
    editor = { type: "text" },
    queryKey,
    className,
    ...inputProps
}: EditableCellProps<T, K>) {
    const [editing, setEditing] = React.useState(autoFocus)
    const [draft, setDraft] = React.useState(() => editorValue(initialValue, editor.type))
    const cancelRef = React.useRef(false)
    const resolvedQueryKey = queryKey ?? ["data-table-records", resource]

    const mutation = useOptimisticMutation({
        queryKey: resolvedQueryKey,
        mutationFn: updateCell,
        updateCache: (old, payload) =>
            optimisticUpdateRecord(
                old,
                payload.recordId,
                payload.columnId,
                payload.value
            ),
    })

    function beginEditing() {
        if (mutation.isPending) return
        cancelRef.current = false
        setDraft(editorValue(initialValue, editor.type))
        setEditing(true)
    }

    function parsedDraft() {
        if (editor.type !== "number") return draft
        if (draft.trim() === "") return null
        const parsed = Number(draft)
        return Number.isFinite(parsed) ? parsed : draft
    }

    function save() {
        if (cancelRef.current) {
            cancelRef.current = false
            return
        }

        setEditing(false)
        const value = parsedDraft()
        if (editorValue(initialValue, editor.type) === editorValue(value, editor.type)) return

        mutation.mutate(
            {
                resource,
                recordId,
                columnId: String(columnId),
                value,
            },
            {
                onError: () => setDraft(editorValue(initialValue, editor.type)),
            }
        )
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) {
        if (event.key === "Enter") {
            event.preventDefault()
            event.currentTarget.blur()
            return
        }

        if (event.key === "Escape") {
            event.preventDefault()
            cancelRef.current = true
            setDraft(editorValue(initialValue, editor.type))
            setEditing(false)
        }
    }

    const editorClassName = cn(
        "absolute inset-0 z-20 h-full w-full bg-background px-2 outline-none",
        editor.type === "number" ? "text-right tabular-nums" : "text-left",
        className,
    )

    return (
        <div
            className={cn(
                "relative flex h-full w-full items-center rounded-md border border-transparent px-2 transition-colors",
                editing
                    ? "z-20 bg-background shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
                    : "hover:border-border hover:bg-background",
                "focus-within:border-primary focus-within:bg-background focus-within:ring-1 focus-within:ring-primary",
            )}
            onDoubleClick={beginEditing}
        >
            {editing ? (
                editor.type === "select" ? (
                    <select
                        autoFocus
                        aria-label={`Edit ${String(columnId)}`}
                        className={editorClassName}
                        disabled={mutation.isPending}
                        value={draft}
                        onBlur={save}
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={handleKeyDown}
                    >
                        {(editor.options ?? []).map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        autoFocus
                        {...inputProps}
                        aria-label={`Edit ${String(columnId)}`}
                        className={editorClassName}
                        disabled={mutation.isPending}
                        inputMode={editor.type === "number" ? "decimal" : inputProps.inputMode}
                        step={editor.type === "number" ? "any" : inputProps.step}
                        type={editor.type}
                        value={draft}
                        onBlur={save}
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                )
            ) : (
                <span className={cn(
                    "flex w-full items-center capitalize",
                    editor.type === "number" ? "justify-end text-right tabular-nums" : "text-left",
                )}>
                    <span className="min-w-0 flex-1">{displayValue ?? editorValue(initialValue, editor.type)}</span>
                    {mutation.isPending ? (
                        <Loader2Icon className="ml-2 size-3.5 shrink-0 animate-spin text-muted-foreground" aria-label="Saving" />
                    ) : null}
                </span>
            )}
        </div>
    )
}
