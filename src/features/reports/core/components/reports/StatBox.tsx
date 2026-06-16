// components/StatBox.tsx
import React from "react";

interface StatBoxProps {
  label: string;
  value: string;
  /** Tailwind text-color class, e.g. "text-primary" or "text-red-400" */
  colorClass?: string;
}

/**
 * Small metric box used inside a ReportCard.
 */
export function StatBox({ label, value, colorClass = "text-foreground" }: StatBoxProps) {
  return (
    <div className="bg-white rounded-lg px-2.5 pt-2.5 pb-2 border border-border shadow-card">
      <p className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground mb-1">
        {label}
      </p>
      <p className={`text-base font-bold tabular-nums leading-none ${colorClass}`}>
        {value}
      </p>
    </div>
  );
}
