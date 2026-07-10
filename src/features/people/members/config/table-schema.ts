import type { TableSchema } from "@/features/data-table/types/tableSchema.types"

export const membersTableSchema: TableSchema = {
    intent: "minimal",
    columns: [
        {
            id: "full_name",
            label: "Member",
            formatter: "avatar",
            meta: {
                avatarField: "avatar",
                avatarFallback: "avatar_fallback",
                weight: "medium",
            },
        },
        { id: "gender", label: "Gender" },
        { id: "age_label", label: "Age" },
        { id: "role_names", label: "Roles" },
        { id: "assembly_label", label: "Assembly" },
        { id: "country", label: "Country" },
        { id: "contact", label: "Contact" },
        {
            id: "membership_status",
            label: "Status",
            meta: { badge: true },
        },
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
