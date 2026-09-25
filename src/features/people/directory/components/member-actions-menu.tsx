"use client"

import { MoreHorizontalIcon, PencilIcon, Trash2Icon, UserRoundCogIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function MemberActionsMenu({ memberName, canManage, onTransfer, onEdit, onDelete, className, deleting = false }: {
    memberName: string
    canManage: boolean
    onTransfer: () => void
    onEdit?: () => void
    onDelete?: () => void
    className?: string
    deleting?: boolean
}) {
    return (
        <span onClick={(event) => event.stopPropagation()}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button type="button" size="icon" variant="ghost" className={className} aria-label={`Options for ${memberName}`}>
                        <MoreHorizontalIcon aria-hidden="true" className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={onTransfer}><UserRoundCogIcon className="size-4" /> Transfer member</DropdownMenuItem>
                    {canManage && onEdit ? <DropdownMenuItem onSelect={onEdit}><PencilIcon className="size-4" /> Edit member</DropdownMenuItem> : null}
                    <DropdownMenuItem variant="destructive" disabled={!onDelete || deleting} onSelect={onDelete}>
                        <Trash2Icon className="size-4" /> Delete member
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </span>
    )
}
