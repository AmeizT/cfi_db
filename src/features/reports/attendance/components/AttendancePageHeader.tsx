interface AttendancePageHeaderProps {
  recordCount: number
  totalHeadcount: number
  selectedCount: number
  onDeleteSelected: () => void
  onAddRow: () => void
}

export function AttendancePageHeader({
  recordCount,
  totalHeadcount,
  selectedCount,
  onDeleteSelected,
  onAddRow,
}: AttendancePageHeaderProps) {
  return (
    <div className="flex justify-between items-end">
      {/* Left: title */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <span
            className="w-2 h-2 rounded-full bg-primary"
            style={{ boxShadow: "0 0 8px var(--color-primary)" }}
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
            Live Records
          </span>
        </div>
        <h1 className="text-4xl font-bold text-foreground tracking-tight leading-none">
          Attendance
        </h1>
        <p className="text-muted-foreground text-[13px] mt-2 font-mono">
          {recordCount} records · {totalHeadcount?.toLocaleString()} total headcount
        </p>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {selectedCount > 0 && (
          <button
            onClick={onDeleteSelected}
            className="
              bg-red-400/8 border border-red-900/40 text-red-400
              rounded-lg px-4 py-2.5 text-xs font-semibold tracking-wide
              hover:bg-red-400/15 transition-colors cursor-pointer
            "
          >
            Delete {selectedCount} selected
          </button>
        )}
        <button
          onClick={onAddRow}
          className="
            bg-primary text-primary-foreground font-bold text-sm
            rounded-lg px-5 py-2.5 tracking-wide cursor-pointer
            hover:bg-primary/90 transition-all
            hover:shadow-[0_0_20px_color-mix(in_srgb,var(--color-primary)_40%,transparent)]
          "
        >
          + New Record
        </button>
      </div>
    </div>
  );
}
