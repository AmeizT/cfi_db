import { DataTableVariant } from "../types/tableVariant.types"

export function useTableStyleSystem(variant: DataTableVariant) {

    const containerClass = [
        variant.mode === "card" ? "rounded-xl shadow-sm" : "",
        variant.mode !== "grid" && variant.border === "subtle" ? "border border-border" : "",
        variant.mode !== "grid" && variant.border === "full" ? "border border-border" : "",
        variant.border === "y" ? "border-0 border-border" : "",
    ].join(" ")

    const rowClass =
        variant.mode === "list"
            ? "border-b border-border"
            : variant.mode === "grid" && variant.border === "full"
                ? "border-b border-border"
                : ""

    const paddingMap = {
        compact: "p-0.5",
        default: {
            grid: "px-2 py-1",
            list: "px-1 py-2",
            card: "p-4",
        },
        comfortable: "h-10",
    }

    const density = variant?.interaction?.density || "default"

    const cellPadding =
        density === "compact"
            ? paddingMap.compact
            : density === "comfortable"
                ? paddingMap.comfortable
                : paddingMap.default[variant.mode]

    const cellClass =
        variant.mode === "grid"
            ? variant.border === "full"
                ? "border-r border-b border-border last:border-r-0 last:border-b-0"
                : variant.border === "subtle"
                    ? "border-r border-b border-border last:border-r-0"
                    : ""
            : ""

    const interactionClass = [
        variant?.interaction?.editable
            ? "cursor-text focus-within:ring-1 focus-within:ring-primary"
            : "",
        variant?.interaction?.selectable
            ? "cursor-pointer hover:bg-muted/50 transition-colors"
            : "",
    ].join(" ")

    const rowInteractionClass = [
        variant?.interaction?.selectable
            ? "hover:bg-muted/40 cursor-pointer transition-colors"
            : "",
    ].join(" ")

    return {
        containerClass,
        rowClass,
        rowInteractionClass,
        cellPadding,
        cellClass,
        interactionClass,
    }
}