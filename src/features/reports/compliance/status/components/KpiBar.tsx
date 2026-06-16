import type { KpiMetric } from "./compliance-data";
import { cn } from "@/lib/utils";

interface Props {
  metrics: KpiMetric[];
}

const trendColors = {
  up:      "text-green-700",
  down:    "text-red-700",
  neutral: "text-gray-400",
};

const valColors: Record<string, string> = {
  "3": "text-green-700",
  "6": "text-red-700",
  "4": "text-red-700",
};

export function KpiBar({ metrics }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-6">
      {metrics.map((m) => (
        <div key={m.label} className="bg-gray-50 rounded-lg px-4 py-3">
          <p className="text-[11px] text-gray-400 mb-1">{m.label}</p>
          <p className={cn("text-2xl font-medium", valColors[m.value] ?? "text-gray-900")}>
            {m.value}
          </p>
          <p className={cn("text-[11px] mt-1 flex items-center gap-1", trendColors[m.trendDir])}>
            {m.trend}
          </p>
        </div>
      ))}
    </div>
  );
}
