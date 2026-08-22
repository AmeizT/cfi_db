import { Badge } from "@/components/ui/badge"
import type { JethroStructuredContent } from "../schemas/jethro"
import { JethroMemberSelectionCard } from "./JethroMemberSelectionCard"
import { JethroTitheConfirmationCard } from "./JethroTitheConfirmationCard"
import { JethroTitheSuccessCard } from "./JethroTitheSuccessCard"

function text(value: unknown) {
    return typeof value === "string" || typeof value === "number" ? String(value) : "—"
}

export function JethroResultCard({ result }: { result: JethroStructuredContent }) {
    if (result.type === "tithe_member_selection") return <JethroMemberSelectionCard result={result} />
    if (result.type === "tithe_confirmation") return <JethroTitheConfirmationCard result={result} />
    if (result.type === "tithe_success") return <JethroTitheSuccessCard result={result} />
    if (result.type === "members") {
        const rows = Array.isArray(result.results) ? result.results as Record<string, unknown>[] : []
        return <div className="mt-3 space-y-2">{rows.map((row, index) => (
            <div key={text(row.public_id) + index} className="rounded-lg border bg-background/70 p-3">
                <div className="font-medium">{text(row.full_name)}</div>
                <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                    <span>{text(row.member_number)}</span><span>{text(row.membership_status)}</span><span>{text(row.assembly_name)}</span>
                </div>
            </div>
        ))}</div>
    }
    if (result.type === "summary") {
        const data = result.data && typeof result.data === "object" ? result.data as Record<string, unknown> : {}
        return <dl className="mt-3 grid grid-cols-2 gap-2">{Object.entries(data).map(([key, value]) => (
            <div key={key} className="rounded-lg border bg-background/70 p-2"><dt className="text-xs capitalize text-muted-foreground">{key.replaceAll("_", " ")}</dt><dd className="text-lg font-semibold">{text(value)}</dd></div>
        ))}</dl>
    }
    const rows = Array.isArray(result.results) ? result.results as Record<string, unknown>[] : []
    return <div className="mt-3 space-y-2">{rows.map((row, index) => (
        <div key={index} className="rounded-lg border bg-background/70 p-3">
            <div className="flex items-center justify-between gap-2"><span className="font-medium">{text(row.report_name)}</span><Badge variant="outline">{text(row.status)}</Badge></div>
            <div className="mt-1 text-xs text-muted-foreground">{text(row.period)} · Submitted {text(row.submitted_date)}</div>
        </div>
    ))}</div>
}
