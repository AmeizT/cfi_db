interface AttendancePageHeaderProps {
  selectedCount: number
  onDeleteSelected: () => void
  onAddRow: () => void
}

export function AttendancePageHeader({
  selectedCount,
  onDeleteSelected,
  onAddRow,
}: AttendancePageHeaderProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <h1 className="text-4xl font-bold text-foreground tracking-tight leading-none">
        Attendance
      </h1>

      {/* Right: actions */}
      <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
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
