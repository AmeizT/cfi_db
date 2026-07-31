import { FormEvent, KeyboardEvent, useRef } from "react"
import { LoaderCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { PlaneIcon } from '@solar-icons/react/bold-duotone/plane'

export function JethroComposer({ value, onChange, onSubmit, loading }: { value: string; onChange: (value: string) => void; onSubmit: () => void; loading: boolean }) {
    const ref = useRef<HTMLTextAreaElement>(null)
    const submit = (event?: FormEvent) => { event?.preventDefault(); if (value.trim() && !loading) onSubmit() }
    const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); submit() }
    }
    return (
        <form onSubmit={submit} className="shrink-0 border-t border-border-subtle bg-background p-3">
            <div className="flex items-end gap-2 rounded-2xl border border-border-subtle bg-surface-subtle p-2 focus-within:ring-2 focus-within:ring-ring focus-within:bg-background focus-within:border-background">
                <Textarea ref={ref} rows={1} maxLength={2000} value={value} onChange={(event) => onChange(event.target.value)} onKeyDown={onKeyDown} placeholder="Ask Jethro…" aria-label="Message Jethro" className="max-h-32 min-h-15 resize-none border-0 bg-transparent p-1 shadow-none focus-visible:ring-0" />
                <Button type="submit" size="icon" disabled={!value.trim() || loading} aria-label="Send message" className="rounded-full">{loading ? <LoaderCircle className="animate-spin" /> : <PlaneIcon />}</Button>
            </div>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">Jethro AI can make mistakes</p>
        </form>
    )
}
