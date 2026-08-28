"use client"

import * as React from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { Loader2Icon } from "lucide-react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import {
    Cancel01Icon,
    CancelCircleIcon,
    CheckmarkCircle02Icon,
    ViewIcon,
} from "@hugeicons/core-free-icons"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import View from "@/components/ui/view"
import { DataTable } from "@/features/reports/core/components/DataTable"
import type { DataTableAction } from "@/features/reports/core/components/DataTable.types"
import { useDataTablePagination } from "@/features/reports/core/components/hooks/useDataTablePagination"
import { useActiveAssemblyId } from "@/hooks/query/use-user"
import { assemblyQueryKeys } from "@/lib/query-keys"
import {
    transferHistoryTableSchema,
    transferRequestsTableSchema,
} from "../config/table-schema"
import {
    memberTransferQueryKeys,
    useAcceptMemberTransfer,
    useCancelMemberTransfer,
    useIncomingMemberTransfers,
    useMemberTransferHistory,
    useOutgoingMemberTransfers,
    useRejectMemberTransfer,
} from "../hooks/use-member-transfers"
import type { MemberTransfer, MemberTransferStatus } from "../schemas/member-transfer"
import {
    buildTransferViewQuery,
    getTransferView,
    TRANSFER_VIEWS,
} from "../utils/transfer-view-params"

type TransferTableRow = Record<string, unknown> & {
    id: number
    member_full_name: string
    from_assembly_name: string
    to_assembly_name: string
    status: MemberTransferStatus
    status_label: string
    effective_date_label: string
    requested_by_label: string
    requested_at_label: string
    reviewed_by_label: string
    completed_at_label: string
    transfer: MemberTransfer
}

type ActionState =
    | { type: "accept"; assemblyId: string | undefined; transfer: MemberTransfer }
    | { type: "reject"; assemblyId: string | undefined; transfer: MemberTransfer }
    | { type: "cancel"; assemblyId: string | undefined; transfer: MemberTransfer }
    | null

type DetailState = {
    assemblyId: string | undefined
    transfer: MemberTransfer
} | null

const tableOptions = {
    enablePinning: true,
}

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Request failed."
}

function formatDate(value?: string | null) {
    if (!value) return "-"

    const date = new Date(`${value}T00:00:00`)
    if (Number.isNaN(date.getTime())) return "-"

    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    }).format(date)
}

function formatDateTime(value?: string | null) {
    if (!value) return "-"

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return "-"

    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date)
}

function mapTransferRow(transfer: MemberTransfer): TransferTableRow {
    return {
        id: transfer.id,
        member_full_name: transfer.member_full_name,
        from_assembly_name: transfer.from_assembly_name,
        to_assembly_name: transfer.to_assembly_name,
        status: transfer.status,
        status_label: transfer.status_label,
        effective_date_label: formatDate(transfer.effective_date),
        requested_by_label: transfer.requested_by_name || "-",
        requested_at_label: formatDateTime(transfer.requested_at),
        reviewed_by_label: transfer.reviewed_by_name || "-",
        completed_at_label: formatDateTime(transfer.completed_at),
        transfer,
    }
}

function TransferStatusBadge({ status, label }: { status: MemberTransferStatus; label: string }) {
    const className =
        status === "completed"
            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300"
            : status === "rejected"
                ? "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300"
                : status === "cancelled"
                    ? "bg-muted text-muted-foreground"
                    : status === "accepted"
                        ? "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300"
                        : "bg-amber-100 text-amber-900 dark:bg-amber-500/15 dark:text-amber-300"

    return <Badge className={className}>{label}</Badge>
}

function EmptyTransfers({ children }: { children: React.ReactNode }) {
    return (
        <div className="rounded-lg border border-border bg-card px-6 py-12 text-center text-sm text-muted-foreground">
            {children}
        </div>
    )
}

function TransferDetailDialog({
    transfer,
    onOpenChange,
}: {
    transfer: MemberTransfer | null
    onOpenChange: (open: boolean) => void
}) {
    return (
        <Dialog open={Boolean(transfer)} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{transfer?.member_full_name ?? "Transfer"}</DialogTitle>
                    <DialogDescription>
                        {transfer?.from_assembly_name} to {transfer?.to_assembly_name}
                    </DialogDescription>
                </DialogHeader>

                {transfer ? (
                    <div className="grid gap-5">
                        <div className="flex flex-wrap gap-2">
                            <TransferStatusBadge status={transfer.status} label={transfer.status_label} />
                            <Badge variant="outline">
                                Effective {formatDate(transfer.effective_date)}
                            </Badge>
                        </div>

                        <dl className="grid gap-3 text-sm sm:grid-cols-2">
                            <div>
                                <dt className="text-xs font-medium text-muted-foreground">Requested By</dt>
                                <dd className="mt-1 text-foreground">{transfer.requested_by_name || "-"}</dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium text-muted-foreground">Requested At</dt>
                                <dd className="mt-1 text-foreground">{formatDateTime(transfer.requested_at)}</dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium text-muted-foreground">Reviewed By</dt>
                                <dd className="mt-1 text-foreground">{transfer.reviewed_by_name || "-"}</dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium text-muted-foreground">Completed At</dt>
                                <dd className="mt-1 text-foreground">{formatDateTime(transfer.completed_at)}</dd>
                            </div>
                        </dl>

                        <div className="grid gap-3 text-sm">
                            <div>
                                <h3 className="text-xs font-medium text-muted-foreground">Reason</h3>
                                <p className="mt-1 whitespace-pre-wrap text-foreground">
                                    {transfer.reason || "-"}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xs font-medium text-muted-foreground">Notes</h3>
                                <p className="mt-1 whitespace-pre-wrap text-foreground">
                                    {transfer.notes || "-"}
                                </p>
                            </div>
                            {transfer.rejection_reason ? (
                                <div>
                                    <h3 className="text-xs font-medium text-muted-foreground">Rejection Reason</h3>
                                    <p className="mt-1 whitespace-pre-wrap text-foreground">
                                        {transfer.rejection_reason}
                                    </p>
                                </div>
                            ) : null}
                        </div>
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    )
}

function TransferActionDialog({
    state,
    isPending,
    onOpenChange,
    onSubmit,
}: {
    state: ActionState
    isPending: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (payload: { notes?: string; rejection_reason?: string }) => void
}) {
    const [notes, setNotes] = React.useState("")
    const [rejectionReason, setRejectionReason] = React.useState("")

    if (!state) return null

    const isReject = state.type === "reject"
    const title =
        state.type === "accept"
            ? "Accept Transfer"
            : state.type === "reject"
                ? "Reject Transfer"
                : "Cancel Transfer"
    const submitLabel =
        state.type === "accept"
            ? "Accept"
            : state.type === "reject"
                ? "Reject"
                : "Cancel"

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        onSubmit({
            notes,
            rejection_reason: isReject ? rejectionReason : undefined,
        })
    }

    return (
        <Dialog open={Boolean(state)} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {state.transfer.member_full_name} from {state.transfer.from_assembly_name} to {state.transfer.to_assembly_name}
                    </DialogDescription>
                </DialogHeader>

                <form className="grid gap-4" onSubmit={handleSubmit}>
                    {isReject ? (
                        <div className="grid gap-2">
                            <Label htmlFor="rejection-reason">Rejection reason</Label>
                            <Textarea
                                id="rejection-reason"
                                required
                                value={rejectionReason}
                                onChange={(event) => setRejectionReason(event.target.value)}
                            />
                        </div>
                    ) : null}

                    <div className="grid gap-2">
                        <Label htmlFor="transfer-action-notes">Notes</Label>
                        <Textarea
                            id="transfer-action-notes"
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
                            disabled={isPending || (isReject && !rejectionReason.trim())}
                            variant={state.type === "accept" ? "default" : "destructive"}
                        >
                            {isPending ? <Loader2Icon className="size-4 animate-spin" /> : null}
                            {isPending ? "Saving..." : submitLabel}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export function MemberTransfersView() {
    const queryClient = useQueryClient()
    const assemblyId = useActiveAssemblyId()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const tab = getTransferView(searchParams)
    const pagination = useDataTablePagination()
    const [storedDetailState, setDetailState] = React.useState<DetailState>(null)
    const [storedActionState, setActionState] = React.useState<ActionState>(null)
    const detailTransfer = storedDetailState && storedDetailState.assemblyId === assemblyId
        ? storedDetailState.transfer
        : null
    const actionState = storedActionState && storedActionState.assemblyId === assemblyId
        ? storedActionState
        : null
    const searchParamsKey = searchParams.toString()
    const search = searchParams.get("search")?.trim() || undefined
    const requestedStatus = searchParams.get("status") || undefined
    const filters = React.useMemo(() => {
        const values: Record<string, string> = {}
        const reserved = new Set(["view", "status", "page", "page_size", "search"])

        new URLSearchParams(searchParamsKey).forEach((value, key) => {
            if (!reserved.has(key)) values[key] = value
        })

        return values
    }, [searchParamsKey])

    const paginationParams = React.useMemo(
        () => ({
            page: pagination.currentPage,
            page_size: pagination.pageSize,
            search,
            filters,
            status: requestedStatus,
        }),
        [filters, pagination.currentPage, pagination.pageSize, requestedStatus, search]
    )
    const openTransferParams = React.useMemo(
        () => ({
            ...paginationParams,
            status: requestedStatus ?? "pending_acceptance,accepted",
        }),
        [paginationParams, requestedStatus]
    )
    const transferTabs = React.useMemo(
        () => TRANSFER_VIEWS.map((view) => ({
            key: view,
            label: view === "incoming"
                ? "Incoming"
                : view === "outgoing"
                    ? "Outgoing"
                    : "History",
            href: `${pathname}?${buildTransferViewQuery(searchParams, view)}`,
        })),
        [pathname, searchParams]
    )

    const incomingQuery = useIncomingMemberTransfers(openTransferParams)
    const outgoingQuery = useOutgoingMemberTransfers(openTransferParams)
    const historyQuery = useMemberTransferHistory(paginationParams)
    const acceptMutation = useAcceptMemberTransfer()
    const rejectMutation = useRejectMemberTransfer()
    const cancelMutation = useCancelMemberTransfer()

    const activeQuery =
        tab === "incoming"
            ? incomingQuery
            : tab === "outgoing"
                ? outgoingQuery
                : historyQuery
    const activeRows = React.useMemo(
        () => activeQuery.data?.rows ?? [],
        [activeQuery.data?.rows]
    )
    const totalRows = activeQuery.data?.count ?? activeRows.length

    const rows = React.useMemo(() => {
        return activeRows.map(mapTransferRow)
    }, [activeRows])

    const isLoading = activeQuery.isLoading || activeQuery.isFetching
    const activeError = activeQuery.error
    const activeIsError = activeQuery.isError

    async function invalidateTransfers() {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: memberTransferQueryKeys.scope(assemblyId) }),
            queryClient.invalidateQueries({ queryKey: assemblyQueryKeys.key(assemblyId, "people", "members") }),
            queryClient.invalidateQueries({ queryKey: assemblyQueryKeys.key(assemblyId, "people", "assembly-memberships") }),
            queryClient.invalidateQueries({ queryKey: assemblyQueryKeys.key(assemblyId, "people", "former-members") }),
            queryClient.invalidateQueries({ queryKey: assemblyQueryKeys.key(assemblyId, "people", "households") }),
        ])
    }

    function handleActionSubmit(payload: { notes?: string; rejection_reason?: string }) {
        if (!actionState) return

        if (actionState.type === "accept") {
            acceptMutation.mutate(
                { id: actionState.transfer.id, notes: payload.notes },
                {
                    onSuccess: async () => {
                        toast.success("Transfer request accepted.")
                        setActionState(null)
                        await invalidateTransfers()
                    },
                    onError: (error) => toast.error(getErrorMessage(error)),
                }
            )
        }

        if (actionState.type === "reject") {
            rejectMutation.mutate(
                {
                    id: actionState.transfer.id,
                    rejection_reason: payload.rejection_reason ?? "",
                    notes: payload.notes,
                },
                {
                    onSuccess: async () => {
                        toast.success("Transfer request rejected.")
                        setActionState(null)
                        await invalidateTransfers()
                    },
                    onError: (error) => toast.error(getErrorMessage(error)),
                }
            )
        }

        if (actionState.type === "cancel") {
            cancelMutation.mutate(
                { id: actionState.transfer.id, notes: payload.notes },
                {
                    onSuccess: async () => {
                        toast.success("Transfer request cancelled.")
                        setActionState(null)
                        await invalidateTransfers()
                    },
                    onError: (error) => toast.error(getErrorMessage(error)),
                }
            )
        }
    }

    function getRowActions(row: TransferTableRow): DataTableAction[] {
        const actions: DataTableAction[] = [
            {
                label: "View",
                icon: ViewIcon,
                variant: "default",
                onClick: () => setDetailState({ assemblyId, transfer: row.transfer }),
            },
        ]

        if (tab === "incoming" && row.status === "pending_acceptance") {
            actions.push(
                {
                    label: "Accept",
                    icon: CheckmarkCircle02Icon,
                    variant: "default",
                    onClick: () => setActionState({ type: "accept", assemblyId, transfer: row.transfer }),
                },
                {
                    label: "Reject",
                    icon: CancelCircleIcon,
                    variant: "destructive",
                    onClick: () => setActionState({ type: "reject", assemblyId, transfer: row.transfer }),
                }
            )
        }

        if (tab === "outgoing" && row.status === "pending_acceptance") {
            actions.push({
                label: "Cancel",
                icon: Cancel01Icon,
                variant: "destructive",
                onClick: () => setActionState({ type: "cancel", assemblyId, transfer: row.transfer }),
            })
        }

        return actions
    }

    const emptyMessage =
        tab === "incoming"
            ? "No incoming transfer requests."
            : tab === "outgoing"
                ? "No outgoing transfer requests."
                : "No transfer history yet."

    const actionPending =
        (actionState?.type === "accept" && acceptMutation.isPending)
        || (actionState?.type === "reject" && rejectMutation.isPending)
        || (actionState?.type === "cancel" && cancelMutation.isPending)

    return (
        <View className="gap-0">
            <View.Body className="gap-4 py-4">
                <View.Tabs items={transferTabs} activeKey={tab} />

                {activeIsError ? (
                    <EmptyTransfers>{getErrorMessage(activeError)}</EmptyTransfers>
                ) : !isLoading && rows.length === 0 ? (
                    <EmptyTransfers>{emptyMessage}</EmptyTransfers>
                ) : (
                    <DataTable<TransferTableRow>
                        variant="simple"
                        data={rows}
                        config={tab === "history" ? transferHistoryTableSchema : transferRequestsTableSchema}
                        isLoading={isLoading}
                        loadingMode="overlay"
                        options={tableOptions}
                        showToolbar={false}
                        showDefaultRowActions={false}
                        rowActions={getRowActions}
                        enableDelete={false}
                        exportFilename={`member-transfers-${tab}`}
                        totalRows={totalRows}
                        currentPage={pagination.currentPage}
                        pageSize={pagination.pageSize}
                        pageSizeOptions={pagination.pageSizeOptions}
                        onPageChange={pagination.onPageChange}
                        onPageSizeChange={pagination.onPageSizeChange}
                    />
                )}
            </View.Body>

            <TransferDetailDialog
                transfer={detailTransfer}
                onOpenChange={(open) => {
                    if (!open) setDetailState(null)
                }}
            />
            <TransferActionDialog
                key={actionState ? `${actionState.type}-${actionState.transfer.id}` : "closed"}
                state={actionState}
                isPending={actionPending}
                onOpenChange={(open) => {
                    if (!open) setActionState(null)
                }}
                onSubmit={handleActionSubmit}
            />
        </View>
    )
}
