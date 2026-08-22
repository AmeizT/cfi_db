"use client"

import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useCancelTithe, useConfirmTithe } from "../hooks/use-jethro"
import type { JethroTitheConfirmation } from "../schemas/jethro"

function Detail({ label, value }: { label: string; value: string }) {
    return <div><dt className="text-xs text-muted-foreground">{label}</dt><dd className="font-medium">{value || "—"}</dd></div>
}

export function JethroTitheConfirmationCard({ result }: { result: JethroTitheConfirmation }) {
    const confirm = useConfirmTithe()
    const cancel = useCancelTithe()
    const draft = result.draft
    const busy = confirm.isPending || cancel.isPending
    if (result.status === "cancelled") {
        return <Alert className="mt-3"><AlertDescription>This tithe draft was cancelled. No record was created.</AlertDescription></Alert>
    }
    return (
        <section className="mt-3 space-y-3 rounded-xl border bg-background p-3 text-foreground">
            <div><h3 className="font-medium">Confirm tithe</h3><p className="text-xs text-muted-foreground">Check every detail before recording.</p></div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
                <Detail label="Member" value={draft.member?.full_name ?? "—"} />
                <Detail label="Member number" value={draft.member?.member_number ?? "—"} />
                <Detail label="Assembly" value={draft.assembly_name} />
                <Detail label="Amount" value={draft.amount} />
                <Detail label="Payment method" value={draft.payment_method} />
                <Detail label="Payment date" value={draft.payment_date} />
                <div className="col-span-2"><Detail label="Reference" value={draft.reference} /></div>
            </dl>
            {(confirm.error || cancel.error) && <Alert variant="destructive"><AlertDescription>{(confirm.error || cancel.error)?.message}</AlertDescription></Alert>}
            <div className="flex justify-end gap-2">
                <Button type="button" size="sm" variant="ghost" disabled={busy} onClick={() => cancel.mutate(draft.public_id)}>Cancel</Button>
                <Button type="button" size="sm" disabled={busy} onClick={() => confirm.mutate(draft.public_id)}>
                    {confirm.isPending && <Loader2 className="animate-spin" />} Confirm and record
                </Button>
            </div>
        </section>
    )
}
