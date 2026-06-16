"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Assembly } from "@/dal/types/index.schemas";
import { ComplianceStatus } from "./compliance-data";
import { ProgressBar } from "./ProgressBar";
import { StatusPill } from "./StatusPill";

interface Props {
  assemblies: Assembly[];
  onSelect?: (assembly: Assembly) => void;
}

type Filter = "all" | ComplianceStatus;

const filters: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Compliant", value: "compliant" },
  { label: "Partial", value: "partial" },
  { label: "Non-compliant", value: "noncompliant" },
];

export function AssemblyLeaderboard({ assemblies, onSelect }: Props) {
  const [active, setActive] = useState<Filter>("all");

  // const filtered = active === "all"
  //   ? assemblies
  //   : assemblies.filter((a) => a.status === active);

  return (
    <div className="mb-6">
      <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-3">Assembly leaderboard</p>

      <div className="flex gap-2 mb-4 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActive(f.value)}
            className={cn(
              "text-xs px-3 py-1.5 rounded-full border transition-colors",
              active === f.value
                ? "bg-theme-50 text-theme-800 border-theme-200"
                : "border-gray-200 text-gray-500 hover:bg-gray-50"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* <div className="bg-white border border-gray-100 rounded-xl divide-y divide-gray-50">
        {filtered.map((a) => (
          <div
            key={a.id}
            onClick={() => onSelect?.(a)}
            className={cn(
              "flex items-center gap-3 px-4 py-3",
              onSelect && "cursor-pointer hover:bg-gray-50 transition-colors"
            )}
          >
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0", a.avatar_fallback)}>
              {a.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{a.name}</p>
              <p className="text-xs text-gray-400">{a.location}</p>
            </div>
            <ProgressBar pct={a.completionPct} size="sm" />
            <StatusPill status={a.status} className="hidden sm:inline-flex" />
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">No assemblies match this filter.</p>
        )}
      </div> */}
    </div>
  );
}
