"use client"

import type { ComponentType } from "react"
import { LayoutGridIcon, Table2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type ResourceViewMode = "table" | "cards"

type ResourceViewToggleProps = {
    value: ResourceViewMode
    onChange: (value: ResourceViewMode) => void
    className?: string
}

const viewOptions: Array<{
    value: ResourceViewMode
    label: string
    icon: ComponentType<{ className?: string }>
}> = [
    { value: "table", label: "Table", icon: Table2Icon },
    { value: "cards", label: "Cards", icon: LayoutGridIcon },
]

export function ResourceViewToggle({
    value,
    onChange,
    className,
}: ResourceViewToggleProps) {
    return (
        <div
            className={cn(
                "inline-flex h-9 items-center gap-1 rounded-lg border border-border bg-card p-1",
                className
            )}
            aria-label="Change resource view"
        >
            {viewOptions.map((option) => {
                const Icon = option.icon
                const isActive = value === option.value

                return (
                    <Button
                        key={option.value}
                        type="button"
                        variant={isActive ? "secondary" : "ghost"}
                        size="sm"
                        className="h-7 px-2"
                        aria-pressed={isActive}
                        title={`Show ${option.label.toLowerCase()} view`}
                        onClick={() => onChange(option.value)}
                    >
                        <Icon className="size-4" aria-hidden="true" />
                        <span>{option.label}</span>
                    </Button>
                )
            })}
        </div>
    )
}
