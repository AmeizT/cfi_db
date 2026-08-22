export function EntityNotesPanel({ notes, title = "Notes" }: { notes?: string | null; title?: string }) {
    return (
        <section className="rounded-lg border border-border-subtle bg-card p-4">
            <h2 className="font-semibold text-foreground">{title}</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                {notes?.trim() || "No notes have been recorded."}
            </p>
        </section>
    )
}
