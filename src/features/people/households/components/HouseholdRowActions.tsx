"use client"

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { MoreHorizontalIcon, Trash2Icon, UserRoundCogIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useActiveAssemblyId } from "@/hooks/query/use-user"
import { assemblyQueryKeys } from "@/lib/query-keys"
import { useUpdateHousehold } from "../../families/hooks"
import { getHouseholdTransferOptions } from "../../families/service"
import type { Household } from "../../families/schema"

export function HouseholdActionsMenu({ name, onTransfer, onDelete, pending }: {
    name: string; onTransfer: () => void; onDelete: () => void; pending: boolean
}) {
    return <span onClick={event => event.stopPropagation()}><DropdownMenu>
        <DropdownMenuTrigger asChild><Button type="button" size="icon" variant="ghost" aria-label={`Options for ${name}`}><MoreHorizontalIcon className="size-4" /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem disabled={pending} onSelect={onTransfer}><UserRoundCogIcon className="size-4" /> Transfer household</DropdownMenuItem>
            <DropdownMenuItem disabled={pending} variant="destructive" onSelect={onDelete}><Trash2Icon className="size-4" /> Delete household</DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu></span>
}

export function TransferHouseholdDialog({ household, onClose, onTransferred }: {
    household: Household; onClose: () => void; onTransferred: () => void
}) {
    const assemblyId = useActiveAssemblyId()
    const options = useQuery({ queryKey: assemblyQueryKeys.key(assemblyId, "household-transfer-options"), queryFn: getHouseholdTransferOptions })
    const mutation = useUpdateHousehold()
    const queryClient = useQueryClient()
    const [destination, setDestination] = useState("")
    const choices = options.data?.filter(item => item.id !== household.assembly) ?? []
    return <Dialog open onOpenChange={open => { if (!open && !mutation.isPending) onClose() }}><DialogContent>
        <form aria-busy={mutation.isPending} className="grid gap-4" onSubmit={event => {
            event.preventDefault()
            if (!destination || mutation.isPending) return
            mutation.mutate({ id: household.id, values: { assembly: Number(destination) } }, {
                onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: assemblyQueryKeys.all }); toast.success("Household transferred"); onTransferred(); onClose() },
                onError: error => toast.error(error.message),
            })
        }}>
            <DialogHeader><DialogTitle>Transfer {household.name}</DialogTitle><DialogDescription>Move this household record to another assembly. Individual members retain their current assemblies. Active members must already belong to the destination assembly.</DialogDescription></DialogHeader>
            <Label htmlFor="household-destination">Destination assembly</Label>
            <select id="household-destination" required value={destination} disabled={mutation.isPending || options.isLoading} onChange={event => setDestination(event.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm"><option value="">Select assembly</option>{choices.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
            {options.isError ? <p role="alert">{options.error.message} <Button type="button" variant="outline" onClick={() => options.refetch()}>Retry</Button></p> : !options.isLoading && !choices.length ? <p className="text-sm text-muted-foreground">You do not have permission to transfer this household to another assembly.</p> : null}
            <DialogFooter><Button type="button" variant="outline" disabled={mutation.isPending} onClick={onClose}>Cancel</Button><Button type="submit" disabled={!destination || mutation.isPending}>{mutation.isPending ? "Transferring…" : "Transfer"}</Button></DialogFooter>
        </form>
    </DialogContent></Dialog>
}
