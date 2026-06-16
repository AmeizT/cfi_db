import { cn } from "@/lib/utils"
import { ComplianceStatus } from "./types"

const config: Record<ComplianceStatus, { dot: string; pill: string; label: string }> = {
    compliant: { 
        dot: "bg-[#639922]",  
        pill: "bg-[#EAF3DE] text-[#3B6D11]",  
        label: "Compliant"     
    },
    partial: { 
        dot: "bg-[#BA7517]",  
        pill: "bg-[#FAEEDA] text-[#854F0B]",  
        label: "Partial"       
    },
    noncompliant: { 
        dot: "bg-[#E24B4A]", 
        pill: "bg-[#FCEBEB] text-[#A32D2D]",  
        label: "Not compliant" 
    },
}

export function StatusPill({ status }: { status: ComplianceStatus }) {
    const { dot, pill, label } = config[status]

    return (
        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap", pill)}>
            <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dot)} />
            {label}
        </span>
    )
}
