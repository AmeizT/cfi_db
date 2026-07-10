import { Bar } from "react-chartjs-2";
import type { ChartOptions, TooltipItem } from "chart.js";

export function ChartCard() {
    const data = {
        labels: ["January", "February", "March"],
        datasets: [
            {
                data: [0, 21000, 0],
                backgroundColor: ["#D3D1C7", "#534AB7", "#D3D1C7"],
                borderRadius: 6,
            },
        ],
    };

    const options: ChartOptions<"bar"> = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx: TooltipItem<"bar">) => {
                        const value = Number(ctx.parsed.y ?? 0)
                        return ` P${value.toLocaleString()}`
                    },
                },
            },
        },
    };

    return (
        <div className="bg-background border rounded-lg p-3.5 space-y-3">
            <Heatmap />

            <div className="h-40">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
}

function Heatmap() {
    return (
        <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground min-w-15">Q1 2026</span>

            <div className="flex gap-1">
                <Cell label="Jan" active={false} />
                <Cell label="Feb" active />
                <Cell label="Mar" active={false} />
            </div>

            <span className="text-muted-foreground ml-2">
                1 of 3 months recorded
            </span>
        </div>
    );
}

function Cell({ label, active }: { label: string; active?: boolean }) {
    return (
        <div
            className={`w-9 h-5 rounded flex items-center justify-center text-[10px] font-medium ${active
                    ? "bg-theme-100 text-theme-700"
                    : "bg-muted text-muted-foreground"
                }`}
        >
            {label}
        </div>
    );
}
