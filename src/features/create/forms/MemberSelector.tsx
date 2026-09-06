"use client"

import { useEffect, useState } from "react"
import { useController, useFormContext } from "react-hook-form"
import { useActiveAssemblyId } from "@/hooks/query/use-user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getCreateOptions, type CreateOptions } from "./actions"

export function MemberSelector({ name, label, multiple = false }: { name: string; label: string; multiple?: boolean }) {
    const assemblyId = useActiveAssemblyId()
    const { control } = useFormContext()
    const { field: { value, onChange, ref: inputRef }, fieldState } = useController({ name, control, defaultValue: multiple ? [] : "" })
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [options, setOptions] = useState<CreateOptions | null>(null)
    const [failed, setFailed] = useState(false)
    const [labels, setLabels] = useState<Record<string, string>>({})
    useEffect(() => {
        let current = true
        const timer = setTimeout(() => {
            if (!assemblyId) return
            getCreateOptions(assemblyId, search, page).then(data => {
                if (current) { setOptions(data); setFailed(false) }
            }).catch(() => { if (current) setFailed(true) })
        }, 250)
        return () => { current = false; clearTimeout(timer) }
    }, [assemblyId, search, page])
    const selected: string[] = multiple ? (value ?? []).map(String) : value ? [String(value)] : []
    return <div className="space-y-2 sm:col-span-2">
        <label htmlFor={`${name}-search`} className="text-sm font-medium">{label}</label>
        <Input id={`${name}-search`} ref={inputRef} maxLength={100} placeholder="Search by first or last name" value={search} onChange={event => { setSearch(event.target.value); setPage(1); setOptions(null) }} />
        {selected.map(id => <Button key={id} type="button" size="sm" variant="outline" className="mr-2" onClick={() => onChange(multiple ? selected.filter(value => value !== id) : "")}>Remove {labels[id] ?? "member"}</Button>)}
        <div className="max-h-52 overflow-y-auto rounded-md border border-border p-2" aria-label={`${label} options`}>
            {failed ? <p role="alert" className="text-sm text-destructive">Unable to load members. Reopen the form to try again.</p> : !options ? <p className="text-sm text-muted-foreground">Loading members…</p> : options.members.length === 0 ? <p className="text-sm text-muted-foreground">No members found.</p> : options.members.map(member => <button key={member.id} type="button" aria-pressed={selected.includes(String(member.id))}
                className="block w-full rounded p-2 text-left text-sm hover:bg-muted aria-pressed:bg-muted"
                onClick={() => {
                    const id = String(member.id)
                    setLabels(previous => ({ ...previous, [id]: member.label }))
                    onChange(multiple ? selected.includes(id) ? selected.filter(value => value !== id) : [...selected, id] : id)
                }}>{member.label}{selected.includes(String(member.id)) ? " ✓" : ""}</button>)}
        </div>
        <div className="flex gap-2">
            <Button type="button" size="sm" variant="outline" disabled={page <= 1} onClick={() => { setPage(page - 1); setOptions(null) }}>Previous</Button>
            <Button type="button" size="sm" variant="outline" disabled={!options?.has_more} onClick={() => { setPage(page + 1); setOptions(null) }}>Next</Button>
        </div>
        {fieldState.error && <p role="alert" className="text-xs text-destructive">{fieldState.error.message}</p>}
    </div>
}
