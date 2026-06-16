"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { updateCell } from "@/features/reports/core/actions/cell-edit"
import { apiRoutes } from "@/config/urls"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation";
import { useOptimisticMutation } from "@/hooks/use-optimistic-mutation";
import { optimisticUpdateRecord } from "@/helpers/optistimicUpdate";

type EditableCellProps<T, K extends keyof T> = React.InputHTMLAttributes<HTMLInputElement> & {
    value: T[K] | undefined
    rowIndex: number
    columnId: K
    resource: keyof typeof apiRoutes 
    recordId: number
    // onSave: (rowIndex: number, columnId: K, value: T[K]) => void
    autoFocus?: boolean
    formatter?: (value: T[K]) => React.ReactNode
    displayValue?: React.ReactNode
    onNavigate?: (direction: "up" | "down" | "left" | "right", rowIndex: number, columnId: K) => void
}

export const queryKeys = {
  attendance: (reportId: string) => ["attendance", reportId] as const,
}

export function EditableCell<T, K extends keyof T>({
    value: initialValue,
    rowIndex,
    recordId,
    columnId,
    autoFocus = false,
    displayValue,
    onNavigate,
    resource,
    ...inputProps
}: EditableCellProps<T, K>) {
    const searchParams = useSearchParams()
    const reportId = searchParams.get("reportid") ?? ""
    const [editing, setEditing] = React.useState(autoFocus)
    const [value, setValue] = React.useState<T[K] | undefined>(initialValue)
    const queryKey = queryKeys[resource as keyof typeof queryKeys]?.(reportId)
    
    const isNumeric = typeof value === "number"

    const queryClient = useQueryClient()

    // const mutation = useMutation({
    //     mutationFn: updateCell,

    //     onMutate: async (payload) => {
    //         await queryClient.cancelQueries({ queryKey })

    //         const previous = queryClient.getQueryData(queryKey)

    //         queryClient.setQueryData(queryKey, (old: unknown) => {
    //             if (!old) return old

    //             type RowData = {
    //                 id: number
    //                 [key: string]: unknown
    //             }

    //             const updateRow = (row: RowData): RowData =>
    //                 row.id === payload.recordId
    //                     ? { ...row, [payload.columnId]: payload.value }
    //                     : row

    //             if (Array.isArray(old)) {
    //                 return old.map((row) => updateRow(row as RowData))
    //             }

    //             if (
    //                 typeof old === "object" &&
    //                 old !== null &&
    //                 "results" in old &&
    //                 Array.isArray(old.results)
    //             ) {
    //                 return {
    //                     ...old,
    //                     results: old.results.map((row) => updateRow(row as RowData)),
    //                 }
    //             }

    //             return old
    //         })

    //         return { previous }
    //     },

    //     onError: (_, __, context) => {
    //         queryClient.setQueryData(queryKey, context?.previous)
    //         toast.error("Update failed")
    //     },

    //     onSuccess: async () => {
    //         await queryClient.invalidateQueries({ queryKey })
    //         toast.success("Updated successfully")
    //         setEditing(false)
    //     },
    // })

    const mutation = useOptimisticMutation({
        queryKey,
        mutationFn: updateCell,

        updateCache: (old, payload) =>
            optimisticUpdateRecord(
                old,
                payload.recordId,
                payload.columnId,
                payload.value
            ),
    })

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            mutation.mutate({
                resource,
                recordId,
                columnId: String(columnId),
                value,
            })
        }
    }

    return (
        <div title="Double-click to edit" className={`px-2 h-full w-full flex items-center rounded-md transition-colors border border-transparent relative ${
                editing ? "z-20 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)]" : "hover:bg-white hover:border-gray-300"
            } focus:bg-white focus:border-mist-300 data-invalid:border-destructive focus-within:border-primary focus-within:ring-1 focus-within:ring-primary`}
            onDoubleClick={() => setEditing(true)}
        >
            {editing ? (
                <input
                    autoFocus
                    {...inputProps}
                    className={cn(
                        `absolute inset-0 w-full h-full outline-none px-2 z-20 
                        ${inputProps.className ?? ""}`, 
                        isNumeric ? "text-right" : "text-left",
                        inputProps.className)
                    }
                    value={value !== undefined ? String(value) : ""}
                    onChange={(e) => {
                        let newVal: unknown = e.target.value
                        if (typeof initialValue === "number") newVal = Number(newVal)
                        setValue(newVal as React.SetStateAction<T[K] | undefined>)
                    }}
                    onBlur={() => {
                        mutation.mutate({
                            resource,
                            recordId,
                            columnId: String(columnId),
                            value,
                        })

                        setEditing(false)

                    }}
                    onKeyDown={handleKeyDown}
                    // onKeyDown={(e) => {
                    //     if (e.key === "Enter") {
                    //         if (value !== undefined) onSave(rowIndex, columnId, value)
                    //         setEditing(false)
                    //     }

                    //     if (e.key === "ArrowUp") {
                    //         e.preventDefault()
                    //         onNavigate?.("up", rowIndex, columnId)
                    //     }

                    //     if (e.key === "ArrowDown") {
                    //         e.preventDefault()
                    //         onNavigate?.("down", rowIndex, columnId)
                    //     }

                    //     if (e.key === "ArrowLeft") {
                    //         e.preventDefault()
                    //         onNavigate?.("left", rowIndex, columnId)
                    //     }

                    //     if (e.key === "ArrowRight") {
                    //         e.preventDefault()
                    //         onNavigate?.("right", rowIndex, columnId)
                    //     }
                    // }}
                />
            ) : (
                <span className={cn(`w-full capitalize ${isNumeric ? "text-right" : "text-left"}`)}>
                    {editing
                        ? null
                        : displayValue ?? (value !== undefined ? String(value) : "")}
                </span>
            )}
        </div>
    )
}