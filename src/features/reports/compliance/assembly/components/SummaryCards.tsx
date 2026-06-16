import { cn } from "@/lib/utils"
import { AnalyzerSummary } from "@/dal/types"

interface Props {
  summary: AnalyzerSummary
}

export function SummaryCards({ summary }: Props) {
  const cards = [
    { 
      label: "Overall",          
      value: `${summary?.overall}%`,                       
      color: summary?.overall >= 80 ? "ok" : summary?.overall >= 50 ? "warn" : "danger" 
    },
    { 
      label: "Compliant months", 
      value: `${summary?.compliant_months} / ${summary?.total_fields}`, 
      color: summary?.compliant_months === summary?.total_fields ? "ok" : "danger" 
    },
    { 
      label: "Missing fields",   
      value: `${summary?.missing}`,                        
      color: summary?.missing === 0 ? "ok" : "danger" 
    },
    { 
      label: "Avg rating",       
      value: `${summary?.average_rating} ★`,                    
      color: Number(summary?.average_rating) >= 3 ? "ok" : Number(summary?.average_rating) >= 2 ? "warn" : "warn" 
    },
  ] as const;

  const valueColor = {
    ok: "text-[#3B6D11]",
    warn: "text-[#BA7517]",
    danger: "text-[#A32D2D]",
  };

  return (
    <div className="flex gap-2.5 flex-wrap">
      {cards.map((c) => (
        <div key={c.label} className="bg-gray-50 rounded-lg px-4 py-2.5 min-w-22.5">
          <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">{c.label}</p>
          <p className={cn("text-xl font-medium", valueColor[c.color])}>{c.value}</p>
        </div>
      ))}
    </div>
  );
}
