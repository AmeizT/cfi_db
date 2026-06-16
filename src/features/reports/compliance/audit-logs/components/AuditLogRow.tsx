"use client";

import { useState } from "react";
import { UserAvatar } from "./UserAvatar";
import { ActionBadge } from "./ActionBadge";
import { ModelBadge } from "./ModelBadge";
import { DiffPanel } from "./DiffPanel";
import { AuditLog } from "@/dal/types";
import { formatTimestamp } from "./audit-log-utils";

interface AuditLogRowProps {
  log: AuditLog;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      style={{ width: 14, height: 14 }}
      className={`transition-transform duration-150 text-gray-400 ${open ? "rotate-180" : ""}`}
    >
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}

export function AuditLogRow({ log }: AuditLogRowProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr
        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <td className="px-3 py-2.5 text-center">
          <ChevronIcon open={open} />
        </td>
        <td className="px-3 py-2.5">
          <div className="flex items-center gap-2">
            <UserAvatar email={log.user_email} />
            <span className="text-[12px] text-gray-500 dark:text-gray-400 truncate">
              {log.user_email}
            </span>
          </div>
        </td>
        <td className="px-3 py-2.5">
          <ActionBadge action={log.action} />
        </td>
        <td className="px-3 py-2.5">
          <ModelBadge model={log.model} />
        </td>
        <td className="px-3 py-2.5 text-[12px] text-gray-400 dark:text-gray-500">
          #{log.object_id}
        </td>
        <td className="px-3 py-2.5 text-[11px] text-gray-400 dark:text-gray-500 whitespace-nowrap">
          {formatTimestamp(log.timestamp)}
        </td>
      </tr>

      {open && (
        <tr className="bg-gray-50 dark:bg-gray-800/40">
          <td
            colSpan={6}
            className="px-4 py-3 border-b border-gray-100 dark:border-gray-800"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <DiffPanel
                label="Before"
                data={log.old_data as Record<string, unknown> | null}
                variant="before"
              />
              <DiffPanel
                label="After"
                data={log.new_data as Record<string, unknown> | null}
                variant="after"
              />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
