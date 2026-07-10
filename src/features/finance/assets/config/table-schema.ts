import type { TableSchema } from "@/features/data-table/types/tableSchema.types"

export const assetsTableSchema: TableSchema = {
    intent: "finance",
    columns: [
        { id: "item_name", label: "Asset", meta: { weight: "medium" } },
        { id: "item_code", label: "Code", meta: { font: "mono" } },
        { id: "asset_type", label: "Type" },
        { id: "condition", label: "Condition", meta: { badge: true } },
        { id: "assembly_label", label: "Assembly" },
        { id: "units", label: "Units", formatter: "number", align: "right" },
        { id: "acquisition_date_label", label: "Acquired" },
        {
            id: "acquisition_cost",
            label: "Value",
            formatter: "currency",
            align: "right",
        },
        { id: "vendor", label: "Vendor" },
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
