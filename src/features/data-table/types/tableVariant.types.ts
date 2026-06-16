export type DataTableVariant = {
    mode: "grid" | "list" | "card"
    border: "none" | "subtle" | "full" | "y"
    theme?: "neutral" | "muted" | "bold"
    interaction?: {
        editable?: boolean
        selectable?: boolean
        density?: "compact" | "default" | "comfortable"
    }
}

