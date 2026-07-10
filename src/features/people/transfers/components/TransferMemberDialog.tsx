"use client"

import * as React from "react"
import { Loader2Icon } from "lucide-react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import type { Member } from "@/features/people/members/schemas/member"
import {
    memberTransferQueryKeys,
    useCreateMemberTransfer,
    useTransferAssemblies,
} from "../hooks/use-member-transfers"

function getToday() {
    return new Date().toISOString().slice(0, 10)
}

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Transfer request failed."
}

export function TransferMemberDialog({
    open,
    member,
    onOpenChange,
}: {
    open: boolean
    member: Member | null
    onOpenChange: (open: boolean) => void
}) {
    const queryClient = useQueryClient()
    const assembliesQuery = useTransferAssemblies()
    const createTransferMutation = useCreateMemberTransfer()
    const [toAssembly, setToAssembly] = React.useState("")
    const [effectiveDate, setEffectiveDate] = React.useState(getToday)
    const [reason, setReason] = React.useState("")
    const [notes, setNotes] = React.useState("")

    const assemblies = React.useMemo(
        () => (assembliesQuery.data ?? []).filter((assembly) => assembly.id !== member?.assembly),
        [assembliesQuery.data, member?.assembly]
    )
    const hasPendingTransfer = Boolean(member?.has_pending_transfer)

    async function invalidateTransferState() {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["people", "members"] }),
            queryClient.invalidateQueries({ queryKey: memberTransferQueryKeys.all }),
        ])
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!member) return

        if (hasPendingTransfer) {
            toast.error("This member already has a pending transfer request.")
            return
        }

        if (!toAssembly) {
            toast.error("To Assembly is required.")
            return
        }

        if (Number(toAssembly) === member.assembly) {
            toast.error("To Assembly cannot be the current assembly.")
            return
        }

        if (!effectiveDate) {
            toast.error("Effective Date is required.")
            return
        }

        createTransferMutation.mutate(
            {
                member: member.id,
                to_assembly: Number(toAssembly),
                effective_date: effectiveDate,
                reason,
                notes,
            },
            {
                onSuccess: async () => {
                    toast.success("Transfer request created successfully.")
                    onOpenChange(false)
                    await invalidateTransferState()
                },
                onError: (error) => toast.error(getErrorMessage(error)),
            }
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Transfer Member</DialogTitle>
                    <DialogDescription>
                        {member?.full_name ?? "Select a member"}
                    </DialogDescription>
                </DialogHeader>

                {hasPendingTransfer ? (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                        This member already has a pending transfer request.
                    </div>
                ) : null}

                <form className="grid gap-4" onSubmit={handleSubmit}>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="to-assembly">To Assembly</Label>
                            <NativeSelect
                                id="to-assembly"
                                required
                                className="min-w-full"
                                disabled={assembliesQuery.isLoading || hasPendingTransfer}
                                value={toAssembly}
                                onChange={(event) => setToAssembly(event.target.value)}
                            >
                                <NativeSelectOption value="">
                                    Select assembly
                                </NativeSelectOption>
                                {assemblies.map((assembly) => (
                                    <NativeSelectOption key={assembly.id} value={String(assembly.id)}>
                                        {assembly.name}
                                    </NativeSelectOption>
                                ))}
                            </NativeSelect>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="effective-date">Effective Date</Label>
                            <Input
                                id="effective-date"
                                required
                                type="date"
                                disabled={hasPendingTransfer}
                                value={effectiveDate}
                                onChange={(event) => setEffectiveDate(event.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="transfer-reason">Reason</Label>
                        <Textarea
                            id="transfer-reason"
                            disabled={hasPendingTransfer}
                            value={reason}
                            onChange={(event) => setReason(event.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="transfer-notes">Notes</Label>
                        <Textarea
                            id="transfer-notes"
                            disabled={hasPendingTransfer}
                            value={notes}
                            onChange={(event) => setNotes(event.target.value)}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Close
                        </Button>
                        <Button
                            type="submit"
                            disabled={hasPendingTransfer || createTransferMutation.isPending}
                        >
                            {createTransferMutation.isPending ? (
                                <Loader2Icon className="size-4 animate-spin" />
                            ) : null}
                            {createTransferMutation.isPending ? "Creating..." : "Create Request"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
