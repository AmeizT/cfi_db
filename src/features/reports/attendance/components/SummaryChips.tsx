import { AttendanceRecord } from "../types/attendance"
import { SUMMARY_CHIPS } from "../constants"

interface SummaryChipsProps {
  totals: Partial<Record<keyof AttendanceRecord, number>>;
}

export function SummaryChips({ totals }: SummaryChipsProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {SUMMARY_CHIPS.map(({ key, label, color }) => (
        <div
          key={key}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-card border border-border rounded-full"
        >
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {label}
          </span>
          <span
            className="font-mono text-sm font-semibold tabular-nums"
            style={{ color }}
          >
            {(totals[key] ?? 0).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}
