import { cn } from "@/lib/utils";
import type { ComplianceStatus } from "./compliance-data";

const config: Record<ComplianceStatus, { dot: string; pill: string; label: string }> = {
  compliant:    { dot: "bg-green-600",  pill: "bg-green-50 text-green-800",  label: "Compliant" },
  partial:      { dot: "bg-amber-500",  pill: "bg-amber-50 text-amber-800",  label: "Partial" },
  noncompliant: { dot: "bg-red-500",    pill: "bg-red-50 text-red-800",      label: "Not compliant" },
};

interface Props {
  status: ComplianceStatus;
  className?: string;
}

export function StatusPill({ status, className }: Props) {
  const { dot, pill, label } = config[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium", pill, className)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", dot)} />
      {label}
    </span>
  );
}
