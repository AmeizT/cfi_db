"use client";

import { useState } from "react"
import { NUMERIC_FIELDS } from "../constants"
import { getHeadcount, getServiceColor } from "../utils"
import { EditableNumber } from "./EditableNumber"
import { Attendance } from "@/dal/types";

interface AttendanceTableRowProps {
  row: Attendance
  isSelected: boolean
  onToggleSelect: (id: number) => void
  onUpdateCell: (id: number, key: keyof Attendance, value: number) => void
  onOpenDrawer: (row: Attendance) => void
}

export function AttendanceTableRow({
  row,
  isSelected,
  onToggleSelect,
  onUpdateCell,
  onOpenDrawer,
}: AttendanceTableRowProps) {
  const [hovered, setHovered] = useState(false);
  const headcount = getHeadcount(row);
  const sc = getServiceColor(row);

  const tdClass = "px-2 w-1/5 border border-border/50 align-middle";

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        transition-colors duration-100 min-h-9
        ${isSelected ? "bg-primary/5" : hovered ? "bg-muted/30" : "bg-transparent"}
      `}
    >
      {/* Checkbox */}
      <td className={`${tdClass} text-center w-11 py-3`}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(row.id)}
          className="cursor-pointer accent-primary"
        />
      </td>

      {/* Date */}
      <td className={`${tdClass} pl-3 w-28`}>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {row.timestamp}
        </span>
      </td>

      {/* Service type badge */}
      <td className={`${tdClass} w-28`}>
        <span className={`
          text-[10px] font-bold px-2 py-0.5 rounded font-mono tracking-wider border whitespace-nowrap
          ${sc.bg} ${sc.text} ${sc.border}
        `}>
          {row.is_special_event
            ? `✦ ${row.special_event_name || "Special"}`
            : row.service_type?.toUpperCase()}
        </span>
      </td>

      {/* Numeric cells */}
      {NUMERIC_FIELDS.map((f) => (
        <td key={f.key} className={`${tdClass}`}>
          <EditableNumber
            value={row[f.key] as number}
            onChange={(v) => onUpdateCell(row.id, f.key, v)}
          />
        </td>
      ))}

      {/* Headcount total */}
      <td className={`${tdClass} w-16 text-center`}>
        <span className={`font-mono text-[13px] font-bold tabular-nums ${headcount > 0 ? "text-primary" : "text-muted-foreground/30"}`}>
          {headcount > 0 ? headcount.toLocaleString() : "—"}
        </span>
      </td>

      <td className={`${tdClass} w-12 text-center`}>
        <button
          onClick={() => onOpenDrawer(row)}
          className={`
            w-6 h-6 rounded-md border border-border text-muted-foreground text-[13px]
            flex items-center justify-center mx-auto
            hover:border-primary hover:text-primary hover:bg-primary/8
            transition-all duration-150
            ${hovered ? "opacity-100" : "opacity-0"}
          `}
        >
          ↗
        </button>
      </td>
    </tr>
  );
}
