import type { FormEvent } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function JethroMemberSearch({ value, disabled, onChange, onSearch }: {
    value: string
    disabled: boolean
    onChange: (value: string) => void
    onSearch: () => void
}) {
    const submit = (event: FormEvent) => {
        event.preventDefault()
        onSearch()
    }
    return (
        <form className="flex gap-2" onSubmit={submit}>
            <Input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search eligible members" disabled={disabled} />
            <Button type="submit" size="icon" variant="secondary" disabled={disabled} aria-label="Search members"><Search /></Button>
        </form>
    )
}
