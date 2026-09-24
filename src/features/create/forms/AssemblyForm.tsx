"use client"

import { useState, type FormEvent } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { isoCodes } from "@/utils/iso-codes"
import { createAssembly, getAssemblyCreateOptions } from "./assembly-actions"

const selectClass = "h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
export function AssemblyForm({ onCancel, onCreated }: { onCancel: () => void; onCreated: () => void }) {
    const options = useQuery({ queryKey: ["assembly-create-options"], queryFn: getAssemblyCreateOptions, gcTime: 0 })
    const queryClient = useQueryClient()
    const [country, setCountry] = useState("")
    const [pending, setPending] = useState(false)
    const [uncertain, setUncertain] = useState(false)
    const [error, setError] = useState("")
    const defaults = options.data?.countries.find(item => item.country_code === country)
    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (pending || uncertain) return
        setPending(true)
        setError("")
        try {
            const result = await createAssembly(new FormData(event.currentTarget))
            if (!result.ok) { setError(result.message); setUncertain(result.uncertain); return }
            toast.success(result.message)
            await queryClient.invalidateQueries({ queryKey: ["user"] })
            await queryClient.invalidateQueries({ queryKey: ["assembly"] })
            onCreated()
        } catch {
            setError("The save could not be confirmed. Check the assemblies before trying again.")
            setUncertain(true)
        } finally { setPending(false) }
    }
    return <form onSubmit={submit} aria-busy={pending} className="grid gap-4">
        {options.isError ? <p role="alert">{options.error.message} <Button type="button" variant="outline" onClick={() => options.refetch()}>Retry</Button></p> : null}
        <fieldset disabled={pending || uncertain || !options.data} className="grid gap-4 sm:grid-cols-2">
            {([
                ["name", "Assembly name", 100], ["code", "Code (optional)", 20], ["address", "Address", 255],
                ["city", "City", 100], ["province", "Province", 100], ["phone_number", "Phone", 20], ["email", "Email", 255],
            ] as const).map(([name, label, maxLength]) => <div key={name} className="grid gap-2"><Label htmlFor={`assembly-${name}`}>{label}</Label><Input id={`assembly-${name}`} name={name} maxLength={maxLength} required={name === "name"} type={name === "email" ? "email" : "text"} /></div>)}
            <div className="grid gap-2"><Label htmlFor="assembly-country">Country</Label><select id="assembly-country" name="country" required className={selectClass} value={country} onChange={event => setCountry(event.target.value)}><option value="">Select country</option>{isoCodes.filter(item => options.data?.countries.some(country => country.country_code === item.code)).map(item => <option key={item.code} value={item.code}>{item.name}</option>)}</select></div>
            <dl className="grid grid-cols-3 gap-3 text-sm sm:col-span-2" aria-live="polite">{[["Country code", defaults?.country_code], ["Locale", defaults?.locale], ["Currency", defaults?.currency]].map(([label, value]) => <div key={label}><dt className="text-muted-foreground">{label}</dt><dd>{value || "—"}</dd></div>)}</dl>
            <div className="grid gap-2 sm:col-span-2"><Label htmlFor="assembly-description">Description</Label><Textarea id="assembly-description" name="description" /></div>
            <div className="grid gap-2"><Label htmlFor="assembly-status">Status</Label><select id="assembly-status" name="status" className={selectClass} defaultValue="open">{["open", "closed", "merged", "suspended"].map(status => <option key={status} value={status}>{status[0].toUpperCase() + status.slice(1)}</option>)}</select></div>
            <div className="grid gap-2"><Label htmlFor="assembly-established">Established date</Label><Input id="assembly-established" name="established_date" type="date" /></div>
            <div className="grid gap-2 sm:col-span-2"><Label htmlFor="assembly-pastors">Assigned pastors</Label><select id="assembly-pastors" name="assigned_pastors" multiple className={`${selectClass} h-24`}>{options.data?.pastors.map(pastor => <option key={pastor.id} value={pastor.id}>{pastor.name}</option>)}</select></div>
            {[["avatar", "Avatar"], ["cover_image", "Cover image"]].map(([name, label]) => <div className="grid gap-2" key={name}><Label htmlFor={`assembly-${name}`}>{label}</Label><Input id={`assembly-${name}`} name={name} type="file" accept="image/*" /></div>)}
            <div className="grid gap-2"><Label htmlFor="assembly-avatar-fallback">Avatar fallback color (optional)</Label><Input id="assembly-avatar-fallback" name="avatar_fallback" maxLength={36} /></div>
            <div className="grid gap-2"><Label htmlFor="assembly-cover-position">Cover image position</Label><Input id="assembly-cover-position" name="cover_image_position" defaultValue="center" maxLength={20} /></div>
        </fieldset>
        {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
        <div className="flex justify-end gap-2"><Button type="button" variant="outline" disabled={pending} onClick={onCancel}>Cancel</Button><Button type="submit" disabled={pending || uncertain || !options.data}>{pending ? "Creating…" : "Create Assembly"}</Button></div>
    </form>
}
