export type ReportStatus = "draft" | "finalized" | "reviewed" | "approved" | "archived"

export interface Report {
    id: number;
    period_start: string;
    period_end: string;
    status: ReportStatus;
    finalized_at: string | null;
    attendance: number;
    tithes: number;
    revenue: number;
    expenses: number;
    notes: string;
}

export interface StatusConfig {
    label: string;
    dotClass: string;
    textClass: string;
    bgClass: string;
    borderClass: string;
    icon: string;
}
