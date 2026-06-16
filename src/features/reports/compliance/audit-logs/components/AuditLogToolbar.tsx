"use client";

import { AuditAction } from "./audit-log";

interface AuditLogToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  actionFilter: string;
  onActionChange: (v: string) => void;
  modelFilter: string;
  onModelChange: (v: string) => void;
  models: string[];
  count: number;
}

const ACTIONS: AuditAction[] = ["Created", "Updated", "Deleted"];

export function AuditLogToolbar({
  search,
  onSearchChange,
  actionFilter,
  onActionChange,
  modelFilter,
  onModelChange,
  models,
  count,
}: AuditLogToolbarProps) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex-wrap">
      <div className="relative flex-1 min-w-40">
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          style={{ width: 13, height: 13 }}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
        >
          <circle cx="6.5" cy="6.5" r="4" />
          <path d="M11 11l3 3" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search user, model, object…"
          className="w-full pl-7 pr-3 py-1.5 text-[12px] border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600"
        />
      </div>

      <select
        value={actionFilter}
        onChange={(e) => onActionChange(e.target.value)}
        className="text-[12px] py-1.5 px-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer"
      >
        <option value="">All actions</option>
        {ACTIONS.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>

      <select
        value={modelFilter}
        onChange={(e) => onModelChange(e.target.value)}
        className="text-[12px] py-1.5 px-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer"
      >
        <option value="">All models</option>
        {models.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      <span className="ml-auto text-[12px] text-gray-400 dark:text-gray-500 whitespace-nowrap">
        {count} {count === 1 ? "entry" : "entries"}
      </span>
    </div>
  );
}
