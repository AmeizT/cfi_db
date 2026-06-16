import { AuditAction } from "./audit-log";
import { actionDotStyles, actionStyles } from "./audit-log-utils";


interface ActionBadgeProps {
  action: AuditAction;
}

export function ActionBadge({ action }: ActionBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full ${actionStyles[action]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${actionDotStyles[action]}`} />
      {action}
    </span>
  );
}
