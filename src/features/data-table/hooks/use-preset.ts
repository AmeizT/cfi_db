import { buildColumns } from "@/features/data-table/utils/buildColumns"

export function useTablePresets(preset: string) {
    switch (preset) {
        case "finance":
            return buildColumns([
                { id: "timestamp", label: "Date", formatter: "date" },
                { id: "amount", formatter: "currency", cellClassName: "font-bold text-green-600" },
                { id: "payment_method" },
                { id: "reference_code" },
                { id: "notes" },
            ]) as unknown

        case "attendance":
            return buildColumns([
                { id: "timestamp", formatter: "date" },
                { id: "member" },
                { id: "status" },
            ]) as unknown

        default:
            return []
    }
}