import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    ReportTab,
    ReportMap,
    getQuarterStatement,
} from "../services/get-quarter-statement";
import { QuarterResponse } from "../../statements/types/summary.types"

export function useQuarterSummary<T extends ReportTab>(
    tab: T,
    q: string,
    period: string
) {
    const query = useQuery({
        queryKey: ["quarterStatement", tab, q, period],
        queryFn: () => getQuarterStatement(tab, q, period),
    });

    const summary = useMemo(() => {
        if (!query.data) return null;

        const response: QuarterResponse<ReportMap[T]["statement"], ReportMap[T]["kpis"]> = query.data;
        const { data, meta } = response;

        const heatmapMap = new Map(
            meta.heatmap.map((h) => [h.month, h.intensity])
        );

        const statements = data.statements.map((s) => ({
            ...s,
            // isBest: meta.best_month?.month === s.month,
            // isWorst: meta.worst_month?.month === s.month,
            heatmapIntensity: heatmapMap.get(s.month) ?? 0,
        }));

        const total = data.statements.reduce(
            (sum, s) => sum + (s.total || 0),
            0
        );

        const missingCount = data.statements.filter((s) => s.is_missing).length;

        return {
            year: data.year,
            quarter: data.quarter,

            statements,
            meta,

            summary: {
                total,
                missingCount,
                recordedMonths: data.statements.length - missingCount,
            },
        };
    }, [query.data]);

    return {
        ...query,
        summary,
    };
}
