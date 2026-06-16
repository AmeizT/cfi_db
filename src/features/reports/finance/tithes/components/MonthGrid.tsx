import { QuarterResponse, TithesQuarterStatement } from "@/features/reports/statements/types/summary.types";
import { Badge } from "./Badge";

export function MonthGrid({ data }: {data: QuarterResponse<TithesQuarterStatement> }) {
    if (!data) return null;

    console.log("monthgriddata", data)

    return (
        <div className="grid grid-cols-3 gap-2.5">
            {/* {data?.statements?.map((statement) => {
                const totalGivers = statement.givers ?? 0;

                return (
                    <MonthCard
                        key={statement.month}
                        month={statement.label}
                        missing={statement.is_missing}
                        best={statement.isBest}
                        stats={[
                            { label: "Total", value: `P${statement.total.toLocaleString()}` },
                            { label: "Givers", value: `${totalGivers}` },
                            {
                                label: "Avg per giver",
                                value: `P${
                                    totalGivers > 0
                                        ? (statement.total / totalGivers).toLocaleString()
                                        : "0"
                                }`,
                            },
                        ]}
                    />
                );
            })} */}
        </div>
    );
}

export function MonthCard({
    month,
    stats,
    missing,
    best,
}: {
    month: string;
    stats: { label: string; value: string }[];
    missing?: boolean;
    best?: boolean;
}) {
    return (
        <div
            className={`rounded-xl border-[1.5px] p-3.5 bg-background ${missing ? "border-dashed opacity-70" : ""
                } ${best ? "border-theme-300 shadow-offset-surface" : "border-border"}`}
        >
            <div className="flex justify-between items-center text-sm font-medium mb-2.5">
                {month}
                {missing && <Badge variant="missing">Missing</Badge>}
                {best && <Badge variant="best">Best</Badge>}
            </div>

            {missing ? (
                <div className="text-center py-4">
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center mx-auto mb-1.5">
                        ⚠️
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                        No tithes recorded
                    </div>
                </div>
            ) : (
                stats.map((s, i: number) => (
                    <div
                        key={i}
                        className="flex justify-between items-center h-9 border-b last:border-none text-xs"
                    >
                        <span className="text-muted-foreground">{s.label}</span>
                        <span className="font-medium">{s.value}</span>
                    </div>
                ))
            )}
        </div>
    );
}