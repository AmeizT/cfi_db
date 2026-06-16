import { cn } from "@/lib/utils";
import { FieldStatus } from "./compliance-data";

export interface HeatmapRow {
  name: string;
  fields: {
    attendance: FieldStatus;
    tithes: FieldStatus;
    income: FieldStatus;
    expenditure: FieldStatus;
  };
}

interface Props {
  rows: HeatmapRow[];
  period?: string;
}

const FIELDS = ["attendance", "tithes", "income", "expenditure"] as const;

export function SubmissionHeatmap({ rows, period = "April 2026" }: Props) {
  return (
    <div className="mb-6">
      <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-3">
        Submission heatmap — {period}
      </p>
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left font-medium text-gray-400 pb-2 pr-4 min-w-[140px]"></th>
                {FIELDS.map((f) => (
                  <th key={f} className="text-center font-medium text-gray-500 pb-2 px-1 capitalize min-w-[90px]">
                    {f}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="space-y-1">
              {rows.map((row) => (
                <tr key={row.name}>
                  <td className="text-gray-500 pr-4 py-1 text-xs whitespace-nowrap">{row.name}</td>
                  {FIELDS.map((f) => {
                    const submitted = row.fields[f] === "submitted";
                    return (
                      <td key={f} className="px-1 py-1">
                        <div className={cn(
                          "h-8 rounded-lg flex items-center justify-center font-medium text-[11px]",
                          submitted ? "bg-green-100 text-green-800" : "bg-red-50 text-red-700"
                        )}>
                          {submitted ? "✓" : "✗"}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-4 mt-4 pt-3 border-t border-gray-50">
          <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <span className="w-3 h-3 rounded bg-green-100 inline-block" />Submitted
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <span className="w-3 h-3 rounded bg-red-50 inline-block" />Missing
          </span>
        </div>
      </div>
    </div>
  );
}
