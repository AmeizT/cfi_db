import type { TableSchema } from "@/features/data-table/types/tableSchema.types"

export const sundaySchoolAttendanceTableSchema: TableSchema = {
    intent: "attendance",
    columns: [
        { id: "date_label", label: "Date" },
        { id: "assembly_name", label: "Assembly" },
        { id: "class_label", label: "Class", meta: { badge: true } },
        { id: "teacher_name", label: "Teacher" },
        { id: "boys", label: "Boys", formatter: "number", align: "right" },
        { id: "girls", label: "Girls", formatter: "number", align: "right" },
        { id: "visitors", label: "Visitors", formatter: "number", align: "right" },
        { id: "first_timers", label: "First Timers", formatter: "number", align: "right" },
        { id: "offering", label: "Offering", formatter: "currency", align: "right" },
        { id: "total_children", label: "Total Children", formatter: "number", align: "right" },
        { id: "grand_total", label: "Grand Total", formatter: "number", align: "right" },
        { id: "status_label", label: "Status", meta: { badge: true } },
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
