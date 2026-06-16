import { cn } from "@/utils/cn";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
} from "lucide-react";

interface TrendChipProps {
  value: number;
  suffix?: string;
  showSign?: boolean;
  className?: string;
}

export function TrendChip({
  value,
  suffix,
  showSign = true,
  className,
}: TrendChipProps) {
  const trend =
    value > 0
      ? "up"
      : value < 0
        ? "down"
        : "neutral";

  const Icon =
    trend === "up"
      ? ArrowUpIcon
      : trend === "down"
        ? ArrowDownIcon
        : ArrowRightIcon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
        trend === "up" &&
          "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        trend === "down" &&
          "bg-red-500/10 text-red-600 dark:text-red-400",
        trend === "neutral" &&
          "bg-muted text-muted-foreground",
        className
      )}
    >
      <Icon className="size-3" />

      <span>
        {showSign && value > 0 ? "+" : ""}
        {value.toFixed(1)}%
      </span>

      {suffix && (
        <span className="text-current/80">
          {suffix}
        </span>
      )}
    </span>
  );
}