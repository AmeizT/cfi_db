import { cn } from "@/lib/utils";
import type { FieldStatus } from "./compliance-data";

const ABBR: Record<string, string> = {
  attendance: "AT",
  tithes: "TI",
  income: "IN",
  expenditure: "EX",
};

interface Props {
  field: string;
  status: FieldStatus;
}

export function FieldDot({ field, status }: Props) {
  const submitted = status === "submitted";
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div
        title={field.charAt(0).toUpperCase() + field.slice(1)}
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium cursor-default",
          submitted ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
        )}
      >
        {ABBR[field] ?? field.slice(0, 2).toUpperCase()}
      </div>
      <span className="text-[10px] text-gray-400">{field.slice(0, 4)}.</span>
    </div>
  );
}
