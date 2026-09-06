import React from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisVertical } from "lucide-react"
import { softDeleteRecord } from "@/features/reports/core/actions/delete/deleteRecord"
import type { ApiDetailRouteKey } from "@/config/urls"
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete03Icon } from "@hugeicons/core-free-icons";
import { IconSvgElement } from "@hugeicons/react"
import { cn } from "@/lib/utils"
import { removeRecordsFromCache } from "@/helpers/removeFromCache"

export interface DataTableAction {
    label: string
    icon: IconSvgElement
    variant: "default" | "destructive" | ""
    onClick: () => void
    disabled?: boolean
}

interface Props {
    actions?: DataTableAction[]
    rowId: string
    resource: ApiDetailRouteKey
    enableDelete?: boolean
    showDefaultActions?: boolean
    triggerClassName?: string
    mutationQueryKey?: readonly unknown[]
}

export function DataTableDropdownMenu({
    actions,
    resource,
    rowId,
    enableDelete = true,
    showDefaultActions = true,
    triggerClassName,
    mutationQueryKey,
}: Props){
    const queryClient = useQueryClient()
    const deleteMutation = useMutation({
        mutationFn: () => softDeleteRecord(resource, rowId),
        onSuccess: async () => {
            if (mutationQueryKey) {
                queryClient.setQueryData(
                    mutationQueryKey,
                    (old: unknown) => removeRecordsFromCache(old, [Number(rowId)]),
                )
            }
            await queryClient.invalidateQueries()
            toast.success("Record deleted")
        },
        onError: (error) => toast.error(error instanceof Error ? error.message : "Record could not be deleted."),
    })

    const defaultActions: DataTableAction[] = [
        ...(enableDelete ? [{
            label: "Delete",
            variant: "destructive",
            onClick: () => {
                if (window.confirm("Delete this record?")) deleteMutation.mutate()
            },
            disabled: deleteMutation.isPending,
            icon: Delete03Icon,
        } satisfies DataTableAction] : []),
    ]

    const resolvedActions = [
        ...(showDefaultActions ? defaultActions : []),
        ...(actions ?? []),
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    aria-label="Open row actions"
                    className={cn("size-8 rounded-md", triggerClassName)}
                    size="icon"
                    variant="ghost"
                >
                    <EllipsisVertical aria-hidden="true" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                <DropdownMenuGroup>
                    <DropdownMenuLabel>
                        Actions
                    </DropdownMenuLabel>

                    {resolvedActions.length ? resolvedActions.map(action => {
                        return (
                            <DropdownMenuItem
                                key={action.label}
                                disabled={action.disabled}
                                variant={action.variant === "destructive" ? "destructive" : "default"}
                                onSelect={(event) => {
                                    event.preventDefault()
                                    if (action.disabled) return
                                    action.onClick()
                                }}
                            >
                                {action.icon && <HugeiconsIcon icon={action.icon} strokeWidth={2} />}
                                {action.label}
                            </DropdownMenuItem>
                        )
                    }) : (
                        <DropdownMenuItem disabled>
                            No actions
                        </DropdownMenuItem>
                    )}
                </DropdownMenuGroup>
                {resolvedActions.length ? <DropdownMenuSeparator /> : null}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
