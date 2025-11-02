import { AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

type HintVariant = "default" | "warning" | "destructive"

interface HintProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: HintVariant
    message: string
}

const hintStyles: Record<HintVariant, string> = {
    default: "bg-primary/5 text-primary border border-primary/30",
    warning: "bg-yellow-50 text-yellow-800 border border-yellow-200",
    destructive: "bg-red-50 text-red-600 border border-red-200",
}

export function Hint({ variant = "default", message, className, ...props }: HintProps) {
    const Icon = variant === "destructive" ? AlertCircle : Info

    return (
        <div
            {...props}
            className={cn(
                "w-full flex items-start gap-x-2 text-[0.8125rem] p-3 rounded-xl",
                hintStyles[variant],
                className
            )}
        >
            <Icon className="size-4 mt-0.5 shrink-0" strokeWidth={2} />
            <span className="text-[0.8125rem]">{message}</span>
        </div>
    )
}