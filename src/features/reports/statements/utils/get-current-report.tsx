import { AssemblyReport } from "@/dal/types"

export function isCurrentMonth(report: AssemblyReport): boolean {
    const now = new Date();
    const d = new Date(report.period_start + "T00:00:00");
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}