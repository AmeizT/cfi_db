"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCancelTithe, useSelectTitheMember, useTitheMemberCandidates } from "../hooks/use-jethro"
import type { JethroTitheMemberSelection } from "../schemas/jethro"
import { JethroMemberCandidate } from "./JethroMemberCandidate"
import { JethroMemberPagination } from "./JethroMemberPagination"
import { JethroMemberSearch } from "./JethroMemberSearch"

export function JethroMemberSelectionCard({ result }: { result: JethroTitheMemberSelection }) {
    const [input, setInput] = useState(result.draft.member_query)
    const [query, setQuery] = useState(result.draft.member_query)
    const [page, setPage] = useState(1)
    const members = useTitheMemberCandidates(result.draft.public_id, query, page)
    const select = useSelectTitheMember()
    const cancel = useCancelTithe()
    const data = members.data ?? result
    const busy = members.isFetching || select.isPending || cancel.isPending

    const search = () => {
        setQuery(input.trim())
        setPage(1)
    }

    return (
        <section className="mt-3 space-y-3 rounded-xl border bg-background p-3 text-foreground">
            <div>
                <h3 className="font-medium">Select a member</h3>
                <p className="text-xs text-muted-foreground">The tithe details are saved in this pending draft.</p>
            </div>
            <JethroMemberSearch value={input} onChange={setInput} onSearch={search} disabled={select.isPending} />
            {members.isLoading && <div className="flex items-center gap-2 text-xs text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Loading eligible members…</div>}
            {members.error && <Alert variant="destructive"><AlertDescription>{members.error.message}</AlertDescription></Alert>}
            {select.error && <Alert variant="destructive"><AlertDescription>{select.error.message}</AlertDescription></Alert>}
            {cancel.error && <Alert variant="destructive"><AlertDescription>{cancel.error.message}</AlertDescription></Alert>}
            {!members.isLoading && data.results.length === 0 && (
                <p className="text-xs text-muted-foreground">
                    {data.empty_reason === "no_eligible_members"
                        ? "No eligible members were found in this assembly. Add or activate the member before recording a tithe."
                        : "No matching member was found. Try another name or clear the search to browse eligible members."}
                </p>
            )}
            <div className="space-y-2">
                {data.results.map((member) => (
                    <JethroMemberCandidate
                        key={member.public_id}
                        member={member}
                        disabled={busy}
                        onSelect={() => select.mutate({ draftId: result.draft.public_id, memberPublicId: member.public_id })}
                    />
                ))}
            </div>
            <JethroMemberPagination
                page={data.pagination.page}
                count={data.pagination.count}
                pageSize={data.pagination.page_size}
                hasNext={data.pagination.has_next}
                disabled={busy}
                onPage={setPage}
            />
            <div className="flex justify-end">
                <button type="button" className="text-xs text-muted-foreground underline-offset-4 hover:underline disabled:opacity-50" disabled={busy} onClick={() => cancel.mutate(result.draft.public_id)}>Cancel draft</button>
            </div>
        </section>
    )
}
