interface EmptyStateProps {
  onAddRow: () => void
}

export function AttendanceEmptyState({ onAddRow }: EmptyStateProps) {
  return (
    <tr>
      <td colSpan={13} className="py-20 text-center">
        <div className="text-4xl mb-3">📋</div>
        <p className="text-foreground/50 text-sm">No records yet</p>
        <p className="text-muted-foreground text-xs mt-1">
          Click{" "}
          <button
            onClick={onAddRow}
            className="text-primary underline underline-offset-2 cursor-pointer"
          >
            + New Record
          </button>{" "}
          to get started
        </p>
      </td>
    </tr>
  );
}
