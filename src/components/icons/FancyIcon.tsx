import * as React from "react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface FancyIconProps extends React.HTMLAttributes<HTMLSpanElement> {
    icon: LucideIcon | React.ReactNode
    size?: number
    label?: string
}

export function FancyIcon({ icon, size=20, label="icon", ...props }: FancyIconProps) {
    const IconElement = typeof icon === "function" ? React.createElement(icon, { size }) : icon

    return (
        <span
            role="img"
            aria-label={label}
            className={cn(
                "p-5 w-fit block relative rounded-full bg-linear-to-b from-zinc-200/60 to-white dark:from-neutral-700 dark:to-neutral-900 data-[variant=success]:from-green-50 dark:data-[variant=success]:from-green-500/20 data-[variant=success]:[&>span]:border-green-600/15",
                props.className
            )}
            {...props}
        >
            <span className="w-16 h-16 flex justify-center items-center bg-white dark:bg-neutral-900 rounded-full border-[1.25px] border-zinc-200 dark:border-neutral-700">
                {IconElement}
            </span>
        </span>
    )
}