import { MonthlyReport } from "../schemas/report"

type ReportStatus = "draft" | "finalized" | "missing"

export interface PlaceholderReport extends Partial<MonthlyReport> {
    period_start: string;
    status: ReportStatus;
    isPlaceholder: boolean;
}