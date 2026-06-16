import { ReportStatus } from "../../types/status.type";
import { STATUS_CONFIG } from "../../utils"


interface StatusBadgeProps {
  status: ReportStatus;
  onChange: (status: ReportStatus) => void;
}

/**
 * Inline status pill with a dropdown to change the status.
 * Clicking the select does not bubble to the card's onClick.
 */
export function StatusBadge({ status, onChange }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];

  return (
    <div
      className={`
        w-fit flex items-center gap-1.5 px-2 h-6 rounded-full border z-10 relative
        ${cfg.bgClass} ${cfg.borderClass}
      `}
    >
      {/* Dot */}
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dotClass}`} />

      {/* Inline select — appearance-none removes the browser arrow */}
      <select
        value={status}
        onChange={(e) => onChange(e.target.value as ReportStatus)}
        onClick={(e) => e.stopPropagation()}
        className={`
          bg-transparent border-none outline-none cursor-pointer appearance-none text-[10px] font-semibold uppercase
          ${cfg.textClass}
        `}
      >
        {(Object.keys(STATUS_CONFIG) as ReportStatus[]).map((k) => (
          <option key={k} value={k} className="bg-background text-foreground capitalize">
            {STATUS_CONFIG[k].label}
          </option>
        ))}
      </select>
    </div>
  );
}
