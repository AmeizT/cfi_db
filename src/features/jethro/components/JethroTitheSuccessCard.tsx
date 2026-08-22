import { CheckCircle2 } from "lucide-react"
import type { JethroTitheSuccess } from "../schemas/jethro"

export function JethroTitheSuccessCard({ result }: { result: JethroTitheSuccess }) {
    return (
        <section className="mt-3 space-y-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 text-foreground">
            <div className="flex items-center gap-2 font-medium text-emerald-700 dark:text-emerald-400"><CheckCircle2 className="size-4" /> Tithe recorded</div>
            <dl className="grid grid-cols-2 gap-2 text-xs">
                <div><dt className="text-muted-foreground">Member</dt><dd>{result.member.full_name}</dd></div>
                <div><dt className="text-muted-foreground">Amount</dt><dd>{result.amount}</dd></div>
                <div><dt className="text-muted-foreground">Payment</dt><dd>{result.payment_method}</dd></div>
                <div><dt className="text-muted-foreground">Date</dt><dd>{result.payment_date}</dd></div>
                <div><dt className="text-muted-foreground">Assembly</dt><dd>{result.assembly_name}</dd></div>
                <div><dt className="text-muted-foreground">Reference</dt><dd>{result.reference || "—"}</dd></div>
                <div className="col-span-2"><dt className="text-muted-foreground">Confirmation ID</dt><dd className="break-all">{result.tithe_public_id}</dd></div>
                <div className="col-span-2"><dt className="text-muted-foreground">Created</dt><dd>{new Date(result.created_at).toLocaleString()}</dd></div>
            </dl>
        </section>
    )
}
