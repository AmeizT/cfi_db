import type { ButtonHTMLAttributes, ReactNode } from "react"
import { ChevronRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type EntityListItemProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    selected: boolean
    leading: ReactNode
    title: string
    description?: ReactNode
    meta?: ReactNode
}

export function EntityListItem({ selected, leading, title, description, meta, className, ...props }: EntityListItemProps) {
    return (
        <button
            type="button"
            role="option"
            aria-selected={selected}
            className={cn(
                "group flex w-full items-center gap-3 border-b border-border-subtle px-4 py-3 text-left outline-none transition-colors hover:bg-accent/60 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                selected && "bg-primary/8 hover:bg-primary/10",
                className,
            )}
            {...props}
        >
            <div className="shrink-0">{leading}</div>
            <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-foreground">{title}</div>
                {description ? <div className="mt-0.5 truncate text-xs text-muted-foreground">{description}</div> : null}
                {meta ? <div className="mt-1 truncate text-xs text-muted-foreground">{meta}</div> : null}
            </div>
            <ChevronRightIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground/70 transition-transform group-hover:translate-x-0.5" />
        </button>
    )
}
