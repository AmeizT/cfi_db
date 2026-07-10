import { Attendance } from "@/dal/types"
import { ServiceBadgeColors } from "../types/attendance"

export function getHeadcount(row: Attendance): number {
    return (row.total_adults ?? 0) + (row.total_children ?? 0) + (row.total_visitors ?? 0)
}

export function getServiceColor(row: Attendance): ServiceBadgeColors {
    if (row.is_special_event) {
        return { bg: "bg-orange-950/40", text: "text-orange-400", border: "border-orange-900/60" };
    }
    switch (row.service_type) {
        case "sunday": return { bg: "bg-green-950/40", text: "text-green-400", border: "border-green-900/60" };
        case "friday": return { bg: "bg-indigo-950/40", text: "text-indigo-400", border: "border-indigo-900/60" };
        default: return { bg: "bg-cyan-950/40", text: "text-cyan-400", border: "border-cyan-900/60" };
    }
}

export function getDrawerBadgeColor(serviceType: string, isSpecial: boolean): ServiceBadgeColors {
    if (isSpecial) {
        return { bg: "bg-orange-950/40", text: "text-orange-400", border: "border-orange-900/60" };
    }
    switch (serviceType) {
        case "Sunday": return { bg: "bg-green-950/40", text: "text-green-400", border: "border-green-900/60" };
        case "Wednesday": return { bg: "bg-indigo-950/40", text: "text-indigo-400", border: "border-indigo-900/60" };
        default: return { bg: "bg-orange-950/40", text: "text-orange-400", border: "border-orange-900/60" };
    }
}
