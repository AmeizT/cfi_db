import { NUMERIC_FIELDS } from "../constants"

interface TableHeaderProps {
  allSelected: boolean;
  onToggleAll: () => void;
}

export function AttendanceTableHeader({ allSelected, onToggleAll }: TableHeaderProps) {
  const thClass = "px-2.5 py-3 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/60 font-medium text-center whitespace-nowrap border-b border-border bg-muted/20";

  return (
    <thead>
      <tr>
        {/* Checkbox */}
        <th className={`${thClass} w-11`}>
          <input
            type="checkbox"
            checked={allSelected}
            onChange={onToggleAll}
            className="cursor-pointer accent-primary"
          />
        </th>

        {/* Date */}
        <th className={`${thClass} text-left! pl-3 w-28`}>Date</th>

        {/* Service */}
        <th className={`${thClass} text-left! w-28`}>Service</th>

        {/* Numeric columns */}
        {NUMERIC_FIELDS.map((f) => (
          <th key={f.key} className={thClass}>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-sm leading-none">{f.icon}</span>
              <span>{f.label}</span>
            </div>
          </th>
        ))}

        {/* Total */}
        <th className={`${thClass} w-16`}>Total</th>

        {/* Actions */}
        <th className="w-12 border-b border-border bg-muted/20" />
      </tr>
    </thead>
  );
}
