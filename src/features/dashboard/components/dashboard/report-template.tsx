"use client"

import type { LucideIcon } from "lucide-react"
import { ArrowRight, ListChecks } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/utils/cn"

interface ReportTemplateCardProps {
    title: string
    category: string
    description: string
    itemCount: number
    icon: LucideIcon
    onUse?: () => void
    className?: string
}

export function ReportTemplateCard({
    title,
    category,
    description,
    itemCount,
    icon: Icon,
    onUse,
    className,
}: ReportTemplateCardProps) {
    return (
        <div
            className={cn(
                "group overflow-hidden rounded-3xl border border-border/60",
                "bg-background",
                "shadow-[0_1px_2px_rgba(0,0,0,0.03),0_8px_24px_rgba(0,0,0,0.035)]",
                "transition-[box-shadow,transform,border-color] duration-200",
                "hover:border-border/60",
                "hover:shadow-[0_2px_4px_rgba(0,0,0,0.04),0_12px_32px_rgba(0,0,0,0.07)]",
                className
            )}
        >
            {/* Template preview */}
            <div className="relative h-44 overflow-hidden border-b border-border/60 bg-surface px-12 pt-6">
                <div
                    className={cn(
                        "relative mx-auto h-40 max-w-62.5",
                        "rounded-xl border border-border/60 bg-background",
                        "px-4 pt-4",
                        "shadow-[0_2px_10px_rgba(0,0,0,0.035)]"
                    )}
                >
                    {/* Preview heading */}
                    <div className="h-2.5 w-24 rounded-full bg-primary/55" />

                    <div className="mt-2 h-2 w-36 rounded-full bg-muted-foreground/15" />

                    <div className="mt-3 h-2 w-16 rounded-full bg-muted-foreground/10" />

                    {/* Rating */}
                    <div className="mt-2 flex items-center gap-1">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="size-2.5 rotate-45 rounded-xs bg-primary/45"
                            />
                        ))}

                        <div className="size-2.5 rotate-45 rounded-xs border border-muted-foreground/15" />
                    </div>

                    {/* Form rows */}
                    <div className="mt-3 space-y-2">
                        <PreviewRow />
                        <PreviewRow />
                        <PreviewRow />
                    </div>

                    {/* Bottom fade / blur */}
                    <div
                        className={cn(
                            "pointer-events-none absolute inset-x-0 bottom-0 h-16",
                            "bg-linear-to-t",
                            "from-background via-background/85 to-transparent",
                            "backdrop-blur-[1px]"
                        )}
                    />
                </div>

                {/* Soft fade into card content */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-surface to-transparent" />
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex items-start gap-3">
                    <div
                        className={cn(
                            "flex size-10 shrink-0 items-center justify-center rounded-xl",
                            "bg-primary/10 text-primary"
                        )}
                    >
                        <Icon className="size-5" />
                    </div>

                    <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-foreground">
                            {title}
                        </h3>

                        <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                            {category}
                        </p>
                    </div>
                </div>

                <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
                    {description}
                </p>

                <div className="mt-4 border-t border-border-subtle pt-3">
                    <div className="flex items-center justify-between gap-3">
                        {/* <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <ListChecks className="size-3.5" />

                            <span>
                                {itemCount} {itemCount === 1 ? "section" : "sections"}
                            </span>
                        </div> */}

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onUse}
                            className={cn(
                                "h-8 gap-2 rounded-lg px-3 text-xs",
                                "transition-colors duration-200",
                                "group-hover:border-primary",
                                "group-hover:bg-primary",
                                "group-hover:text-primary-foreground"
                            )}
                        >
                            Download template
                            <ArrowRight className="size-3.5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function PreviewRow() {
    return (
        <div className="flex items-center gap-2">
            <div className="size-2.5 rounded-full border border-muted-foreground/15" />
            <div className="h-2 w-28 rounded-full bg-muted-foreground/8" />
        </div>
    )
}