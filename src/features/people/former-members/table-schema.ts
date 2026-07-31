import type { TableSchema } from "@/features/data-table/types/tableSchema.types"

export const formerMembersTableSchema: TableSchema = {
    intent: "minimal",
    columns: [
        { id: "member_full_name", label: "Member" },
        { id: "former_assembly_name", label: "Former Assembly" },
        { id: "ended_on", label: "Ended", formatter: "date" },
        { id: "end_reason", label: "Reason", meta: { badge: true } },
        { id: "current_assembly_name", label: "Current Assembly" },
    ],
    variant: { mode: "list", border: "y", interaction: { selectable: false } },
}
