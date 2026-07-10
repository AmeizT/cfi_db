
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
} from "chart.js";
import { KPIGrid } from "../components/KPIGrid";
import { MonthGrid } from "../components/MonthGrid";
import { ChartCard } from "../components/Heatmap";
import { SectionLabel } from "../components/SectionLabel";
import { QuarterResponse, TithesKpis, TithesQuarterStatement } from "@/features/reports/statements/types/summary.types";
import { useSearchParams } from "next/navigation";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip)

interface TithesSummaryProps {
    tithesQuarterStatement: QuarterResponse<TithesQuarterStatement, TithesKpis>
}

export default function TithesSummary({ tithesQuarterStatement }: TithesSummaryProps) {
    const searchParams = useSearchParams()
    const q = searchParams.get("q") || ""

    return (
        <div className="py-4 w-full space-y-5">
            <KPIGrid q={q} data={tithesQuarterStatement} />

            <SectionLabel>
                Monthly breakdown
            </SectionLabel>

            <MonthGrid data={tithesQuarterStatement} />

            <SectionLabel>
                Activity heatmap
            </SectionLabel>
            
            <ChartCard />

            <p className="text-[11px] text-muted-foreground text-center pt-1">
                Previous quarter (Q4 2025) total unavailable — quarter change cannot be calculated
            </p>
        </div>
    );
}
