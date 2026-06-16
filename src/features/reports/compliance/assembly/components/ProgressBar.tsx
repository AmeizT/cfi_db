import { cn } from "@/lib/utils";

interface Props {
  pct: number;
}

function fillColor(pct: number) {
  if (pct >= 100) return "bg-[#639922]";
  if (pct >= 75)  return "bg-[#EF9F27]";
  if (pct >= 50)  return "bg-[#EF9F27]";
  return "bg-[#E24B4A]";
}

function labelColor(pct: number) {
  if (pct >= 100) return "text-[#3B6D11]";
  if (pct >= 50)  return "text-[#854F0B]";
  return "text-[#A32D2D]";
}

export function ProgressBar({ pct }: Props) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", fillColor(pct))}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <span className={cn("text-xs font-medium min-w-8", labelColor(pct))}>
        {pct}%
      </span>
    </div>
  );
}
