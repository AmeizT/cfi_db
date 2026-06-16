import React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { PaintBrush04Icon } from "@hugeicons/core-free-icons"
import { PremiumThemeSelector } from "./ThemeSelector"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

export function ThemeMenuItem() {
    const [open, setOpen] = React.useState(false)

    return (
        <React.Fragment>
            <DropdownMenuItem
                onSelect={(e) => {
                    e.preventDefault()
                    setOpen(true)
                }}
            >
                <HugeiconsIcon 
                    icon={PaintBrush04Icon} 
                    strokeWidth={2} 
                    className="size-5.5" 
                />
                Theme
            </DropdownMenuItem>

            <PremiumThemeSelector open={open} onOpenChange={setOpen} />
        </React.Fragment>
    )
}