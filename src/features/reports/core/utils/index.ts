import { AssemblyReport } from "../schemas/report/assembly.schema";
import { ReportStatus } from "../types/status.type"

export function fmtShort(n: number): string {
    return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString()
}

export function fmtCurrency(n: number): string {
    return n.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    });
}

export function fmtDate(dateStr: string): string {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
    });
}

// ── Status config ─────────────────────────────────────────────────────────────

export const STATUS_CONFIG: Record<
    ReportStatus,
    {
        label: string;
        textClass: string;
        bgClass: string;
        borderClass: string;
        dotClass: string;
        accentBar: string;
    }
> = {
    finalized: {
        label: "Finalized",
        textClass: "text-primary",
        bgClass: "bg-primary/10",
        borderClass: "border-primary/25",
        dotClass: "bg-primary",
        accentBar: "linear-gradient(90deg, var(--color-primary), color-mix(in srgb, var(--color-primary) 70%, white))",
    },
    draft: {
        label: "Draft",
        textClass: "text-orange-400",
        bgClass: "bg-orange-400/10",
        borderClass: "border-orange-400/25",
        dotClass: "bg-orange-400",
        accentBar: "linear-gradient(90deg, #fb923c, #f97316)",
    },
    approved: {
        label: "Approved",
        textClass: "text-muted-foreground",
        bgClass: "bg-muted/50",
        borderClass: "border-border",
        dotClass: "bg-muted-foreground/40",
        accentBar: "",
    },
    reviewed: {
        label: "Approved",
        textClass: "text-muted-foreground",
        bgClass: "bg-muted/50",
        borderClass: "border-border",
        dotClass: "bg-muted-foreground/40",
        accentBar: "",
    },
    archived: {
        label: "Approved",
        textClass: "text-muted-foreground",
        bgClass: "bg-muted/50",
        borderClass: "border-border",
        dotClass: "bg-muted-foreground/40",
        accentBar: "",
    },

};

// ── Derived helpers ───────────────────────────────────────────────────────────

export function isCurrentMonth(report: AssemblyReport): boolean {
    const now = new Date();
    const d = new Date(report.period_start + "T00:00:00");
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export function getSparkValues(report: AssemblyReport, allReports: AssemblyReport[]): number[] {
    return allReports
        .filter((r) => r.period_end <= report.period_end && r.attendance_total > 0)
        .map((r) => r.attendance_total);
}
