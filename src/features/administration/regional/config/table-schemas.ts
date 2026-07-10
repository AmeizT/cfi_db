import type { TableSchema } from "@/features/data-table/types/tableSchema.types"

const baseVariant = {
    mode: "list",
    border: "y",
    theme: "neutral",
    interaction: {
        editable: false,
        selectable: true,
        density: "comfortable",
    },
} as const

export const regionalAssembliesTableSchema: TableSchema = {
    intent: "minimal",
    columns: [
        { id: "name", label: "Assembly Name", meta: { weight: "medium" } },
        { id: "code", label: "Code", meta: { font: "mono" } },
        { id: "zone_name", label: "Zone" },
        { id: "country", label: "Country" },
        { id: "city", label: "City" },
        { id: "pastor_names", label: "Pastor" },
        { id: "status", label: "Status", meta: { badge: true } },
    ],
    variant: baseVariant,
}

export const regionalUsersTableSchema: TableSchema = {
    intent: "minimal",
    columns: [
        { id: "full_name", label: "Name", meta: { weight: "medium" } },
        { id: "email", label: "Email" },
        { id: "role_names", label: "Role" },
        { id: "church_name", label: "Assembly" },
        { id: "zone_name", label: "Zone" },
        { id: "church_country", label: "Country" },
        { id: "status", label: "Status", meta: { badge: true } },
    ],
    variant: baseVariant,
}
