import { cn } from "@/lib/utils";

interface Props {
  pct: number;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md";
}

function barColor(pct: number) {
  if (pct >= 100) return "bg-green-600";
  if (pct >= 75)  return "bg-amber-400";
  if (pct >= 50)  return "bg-amber-400";
  return "bg-red-500";
}

function labelColor(pct: number) {
  if (pct >= 100) return "text-green-800";
  if (pct >= 50)  return "text-amber-800";
  return "text-red-700";
}

export function ProgressBar({ pct, className, showLabel = true, size = "md" }: Props) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("bg-gray-100 rounded-full overflow-hidden", size === "sm" ? "h-1.5 w-16" : "h-1.5 w-20")}>
        <div
          className={cn("h-full rounded-full transition-all", barColor(pct))}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      {showLabel && (
        <span className={cn("text-xs font-medium min-w-[2.5rem]", labelColor(pct))}>
          {pct}%
        </span>
      )}
    </div>
  );
}
