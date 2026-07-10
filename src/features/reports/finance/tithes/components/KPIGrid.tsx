import { Badge } from "./Badge"
import { QuarterResponse, TithesKpis, TithesQuarterStatement } from "@/features/reports/statements/types/summary.types"

interface KPIGridProps {
    q: string
    data: QuarterResponse<TithesQuarterStatement, TithesKpis>
}

export function KPIGrid({ q, data }: KPIGridProps) {
    console.log("kpi",data)
    return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-2.5">
            <KPI label={`Q${q} Total`} value="P21,000" sub="Jan - Mar 2026" />
            <KPI label="Total givers" value="6" sub={`across Q${q}`} />
            <KPI label="Avg per giver" value="P3,500" sub="February only" />
            <KPI
                label="Trend"
                value={<Badge variant="stable">Stable</Badge>}
                sub="vs Q4 2025 — no data"
            />
            <KPI
                label="Best month"
                value="February"
                badge={<Badge variant="best">P21,000</Badge>}
            />
            <KPI
                label="Missing records"
                value="2"
                badge={<Badge variant="missing">Jan & Mar</Badge>}
            />
        </div>
    );
}

interface KPIProps {
    label: string
    value: React.ReactNode
    sub?: string
    badge?: React.ReactNode
}

export function KPI({ label, value, sub, badge }: KPIProps) {
    return (
        <div className="bg-gray-100 rounded-2xl p-4">
            <div className="text-xs text-muted-foreground mb-1">{label}</div>
            <div className="text-xl font-medium text-foreground">{value}</div>
            {sub && <div className="text-[11px] text-muted-foreground mt-1">{sub}</div>}
            {badge && <div className="mt-1">{badge}</div>}
        </div>
    );
}
