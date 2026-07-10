import React from "react"

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
import { Delete03Icon, Edit02Icon } from "@hugeicons/core-free-icons";
import { IconSvgElement } from "@hugeicons/react"

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
}

function handleTableAction() {
    return console.log("table action")
}

const initialState = {
    success: false,
    status: undefined,
    error: ""
}

export function DataTableDropdownMenu({
    actions,
    resource,
    rowId,
    enableDelete = true,
    showDefaultActions = true,
}: Props){
    const [, action] = React.useActionState(
        softDeleteRecord.bind(null, resource, rowId),
        initialState
    )

    const defaultActions: DataTableAction[] = [
        {
            label: "Edit",
            variant: "default",
            onClick: handleTableAction,
            icon: Edit02Icon
        },
        ...(enableDelete ? [{
            label: "Delete",
            variant: "destructive",
            onClick: () => React.startTransition(action),
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
                    className="size-8 rounded-md"
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
