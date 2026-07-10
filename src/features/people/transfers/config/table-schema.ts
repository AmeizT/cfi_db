import type { TableSchema } from "@/features/data-table/types/tableSchema.types"

const baseVariant = {
    mode: "list",
    border: "y",
    theme: "neutral",
    interaction: {
        editable: false,
        selectable: false,
        density: "comfortable",
    },
}

export const transferRequestsTableSchema = {
    intent: "minimal",
    columns: [
        { id: "member_full_name", label: "Member" },
        { id: "from_assembly_name", label: "From Assembly" },
        { id: "to_assembly_name", label: "To Assembly" },
        { id: "effective_date_label", label: "Effective Date" },
        { id: "status_label", label: "Status", meta: { badge: true } },
        { id: "requested_by_label", label: "Requested By" },
        { id: "requested_at_label", label: "Requested At" },
    ],
    variant: baseVariant,
} as unknown as TableSchema

export const transferHistoryTableSchema = {
    intent: "minimal",
    columns: [
        { id: "member_full_name", label: "Member" },
        { id: "from_assembly_name", label: "From Assembly" },
        { id: "to_assembly_name", label: "To Assembly" },
        { id: "status_label", label: "Status", meta: { badge: true } },
        { id: "effective_date_label", label: "Effective Date" },
        { id: "requested_at_label", label: "Requested At" },
        { id: "completed_at_label", label: "Completed At" },
        { id: "reviewed_by_label", label: "Reviewed By" },
    ],
    variant: baseVariant,
} as unknown as TableSchema
