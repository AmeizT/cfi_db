import { Button } from "@/components/ui/button"

const suggestions = [
    "How many active members do we have?",
    "Who joined this month?",
    "Search for member S2427056",
    "Which reports are outstanding?",
]

export function JethroEmptyState({ onSelect }: { onSelect: (prompt: string) => void }) {
    return (
        <section className="flex h-full min-h-0 flex-col items-center justify-center overflow-y-auto px-5 py-6 text-center">
            <h3 className="text-lg font-semibold">How can Jethro help?</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Ask about members, membership totals, reports, tithes, or how to use CFI Workspace.
            </p>
            <div className="mt-6 grid w-full gap-2 sm:grid-cols-2">
                {suggestions.map((suggestion) => (
                    <Button key={suggestion} variant="outline" className="h-auto justify-start whitespace-normal px-3 py-2 text-left font-normal" onClick={() => onSelect(suggestion)}>
                        {suggestion}
                    </Button>
                ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">For tithe requests, include the payment date as YYYY-MM-DD.</p>
        </section>
    )
}
