import { cn } from "@/lib/utils";
import { FieldStatus } from "./types";


const ABBR: Record<string, string> = {
  attendance:  "AT",
  tithes:      "TI",
  revenue:     "RV",
  overhead:    "OH",
};

const SHORT: Record<string, string> = {
  attendance:  "Att.",
  tithes:      "Tth.",
  revenue:     "Rvn.",
  overhead:    "Ovh.",
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
          "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium cursor-default select-none",
          submitted
            ? "bg-[#EAF3DE] text-[#3B6D11]"
            : "bg-[#FCEBEB] text-[#A32D2D]"
        )}
      >
        {ABBR[field] ?? field.slice(0, 2).toUpperCase()}
      </div>
      <span className="text-[10px] text-gray-400 leading-none">
        {SHORT[field] ?? field.slice(0, 4)}
      </span>
    </div>
  );
}
