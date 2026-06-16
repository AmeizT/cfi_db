import { AttendanceRecord } from "../types/attendance"
import { NUMERIC_FIELDS } from "../constants"

interface AttendanceTableFooterProps {
  totals: Partial<Record<keyof AttendanceRecord, number>>
  totalHeadcount: number
}

export function AttendanceTableFooter({ totals, totalHeadcount }: AttendanceTableFooterProps) {
  return (
    <tfoot>
      <tr className="bg-muted/20 border-t border-border">
        {/* Checkbox + Date + Service spacers */}
        <td className="w-11" />
        <td className="pl-3 py-3">
          <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/50">
            Totals
          </span>
        </td>
        <td className="w-28" />

        {/* Numeric totals */}
        {NUMERIC_FIELDS.map((f) => (
          <td key={f.key} className="px-2 py-3 text-center">
            <span className="font-mono text-xs font-semibold tabular-nums text-muted-foreground">
              {(totals[f.key] ?? 0) > 0
                ? (totals[f.key] ?? 0).toLocaleString()
                : "—"}
            </span>
          </td>
        ))}

        {/* Total headcount */}
        <td className="w-16 text-center px-2 py-3">
          <span className="font-mono text-[13px] font-bold tabular-nums text-primary">
            {totalHeadcount.toLocaleString()}
          </span>
        </td>

        {/* Actions spacer */}
        <td className="w-12" />
      </tr>
    </tfoot>
  );
}
