import type { TableSchema } from "@/features/data-table/types/tableSchema.types"

export const homecellsTableSchema: TableSchema = {
    intent: "minimal",
    columns: [
        { id: "group_name", label: "Home Cell", meta: { weight: "medium" } },
        { id: "id_label", label: "Record ID", meta: { font: "mono" } },
    ],
    variant: {
        mode: "list",
        border: "y",
        theme: "neutral",
        interaction: {
            editable: false,
            selectable: false,
            density: "comfortable",
        },
    },
}
