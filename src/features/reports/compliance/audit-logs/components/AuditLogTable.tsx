"use client";

import { useMemo, useState } from "react";
import { AuditLogToolbar } from "./AuditLogToolbar";
import { AuditLogRow } from "./AuditLogRow";
import { AuditLog } from "@/dal/types";

interface AuditLogTableProps {
  logs: AuditLog[];
}

export function AuditLogTable({ logs }: AuditLogTableProps) {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [modelFilter, setModelFilter] = useState("");

  const models = useMemo(
    () => [...new Set(logs?.map((l) => l.model))].sort(),
    [logs]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return logs?.filter((l) => {
      if (actionFilter && l.action !== actionFilter) return false;
      if (modelFilter && l.model !== modelFilter) return false;
      if (
        q &&
        !l.user_email?.toLowerCase().includes(q) &&
        !l.model?.toLowerCase().includes(q) &&
        !String(l.object_id).includes(q)
      )
        return false;
      return true;
    });
  }, [logs, search, actionFilter, modelFilter]);

  return (
    <div className="border border-gray-100 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
      <AuditLogToolbar
        search={search}
        onSearchChange={setSearch}
        actionFilter={actionFilter}
        onActionChange={setActionFilter}
        modelFilter={modelFilter}
        onModelChange={setModelFilter}
        models={models}
        count={filtered?.length}
      />

      <div className="">
        <table className="w-full border-collapse text-[12px]" style={{ tableLayout: "fixed" }}>
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50">
              <th className="w-9 px-3 py-2 text-left" />
              <th className="w-[28%] px-3 py-2 text-left text-[10px] font-medium uppercase tracking-widest text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800">
                User
              </th>
              <th className="w-[14%] px-3 py-2 text-left text-[10px] font-medium uppercase tracking-widest text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800">
                Action
              </th>
              <th className="w-[14%] px-3 py-2 text-left text-[10px] font-medium uppercase tracking-widest text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800">
                Model
              </th>
              <th className="w-[10%] px-3 py-2 text-left text-[10px] font-medium uppercase tracking-widest text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800">
                Object
              </th>
              <th className="px-3 py-2 text-left text-[10px] font-medium uppercase tracking-widest text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered?.length > 0 ? (
              filtered?.map((log) => <AuditLogRow key={log.id} log={log} />)
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-[13px] text-gray-400 dark:text-gray-500"
                >
                  No entries match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
