import { DIFF_SKIP_KEYS } from "./audit-log-utils"

interface DiffPanelProps {
  label: string;
  data: Record<string, unknown> | null;
  variant: "before" | "after";
}

export function DiffPanel({ label, data, variant }: DiffPanelProps) {
  const headerClass =
    variant === "after"
      ? "bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300"
      : "bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300";

  const entries = data
    ? Object.entries(data).filter(([k]) => !DIFF_SKIP_KEYS.includes(k))
    : null;

  return (
    <div className="rounded-lg border border-gray-100 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900">
      <div
        className={`px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 ${headerClass}`}
      >
        {label}
      </div>
      <div className="px-3 py-2.5 space-y-1">
        {entries ? (
          entries.map(([key, value]) => (
            <div key={key} className="flex justify-between gap-3 text-[11px]">
              <span className="text-gray-400 dark:text-gray-500 shrink-0">
                {key}
              </span>
              <span className="text-gray-900 dark:text-gray-100 text-right break-all tabular-nums">
                {value === null || value === "" ? "—" : String(value)}
              </span>
            </div>
          ))
        ) : (
          <span className="text-[11px] text-gray-400 dark:text-gray-500">
            None
          </span>
        )}
      </div>
    </div>
  );
}
