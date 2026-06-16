import { MonthlyReport } from "../schemas/report"

type ReportStatus = "draft" | "finalized" | "missing"

export interface PlaceholderReport extends Partial<MonthlyReport> {
    period_start: string;
    status: ReportStatus;
    isPlaceholder: boolean;
}

export interface PlaceholderReportList {
    reports: PlaceholderReport[];
    total: number;
    page: number;
    limit: number;
}