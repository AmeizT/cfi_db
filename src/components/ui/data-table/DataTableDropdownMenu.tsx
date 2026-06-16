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
import { apiRoutes } from "@/config/urls"
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete03Icon, Edit02Icon } from "@hugeicons/core-free-icons";
import { IconSvgElement } from "@hugeicons/react"

export interface DataTableAction {
    label: string
    icon: IconSvgElement
    variant: "default" | "destructive" | ""
    onClick: () => void
}

interface Props {
    actions?: DataTableAction[]
    rowId: string
    resource: keyof typeof apiRoutes
}

function handleTableAction() {
    return console.log("table action")
}

const initialState = {
    success: false,
    status: undefined,
    error: ""
}

export function DataTableDropdownMenu({ actions, resource, rowId }: Props){
    const [state, action, pending] = React.useActionState(
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
        {
            label: "Delete",
            variant: "destructive",
            onClick: () => React.startTransition(action),
            icon: Delete03Icon,
        },
    ]

    const resolvedActions = [
        ...defaultActions,
        ...(actions ?? []),
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <EllipsisVertical />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                <DropdownMenuGroup>
                    <DropdownMenuLabel>
                        Actions
                    </DropdownMenuLabel>

                    {resolvedActions?.map(action => {
                        return (
                            <DropdownMenuItem key={action.label} asChild>
                                <button onClick={action.onClick}>
                                    {action.icon && <HugeiconsIcon icon={action.icon} strokeWidth={2} />}
                                    {action.label}
                                </button>
                            </DropdownMenuItem>
                        )
                    })}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}