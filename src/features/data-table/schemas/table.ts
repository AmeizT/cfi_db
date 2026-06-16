import { TableSchema } from "../types/tableSchema.types"

export const TABLE_SCHEMAS: Record<string, TableSchema> = {
    finance: {
        intent: "finance",
        columns: [
            { id: "timestamp", label: "Date", formatter: "date" },
            { id: "amount", formatter: "currency", align: "right", isFooterSum: true },
            { id: "payment_method", label: "Payment Method" },
            { id: "reference_code", label: "Reference" },
            { id: "notes" },
        ],
        variant: {
            mode: "grid",
            border: "subtle",
            theme: "neutral",
            interaction: {
                "editable": true,
                "selectable": true,
                "density": "comfortable",
            }
        },
    },

    attendance: {
        intent: "attendance",
        columns: [
            { id: "timestamp", formatter: "date" },
            { id: "member" },
            { id: "status" },
        ],
        variant: {
            mode: "grid",
            border: "full",
            theme: "muted"
        },
    },

    minimal: {
        intent: "minimal",
        columns: [],
        variant: {
            mode: "list",
            border: "none",
            theme: "neutral",
        },
    },
}