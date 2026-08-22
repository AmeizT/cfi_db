import React from "react"
import { PremiumThemeSelector } from "./ThemeSelector"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { PaintRollerIcon } from '@solar-icons/react/line-duotone/paint-roller'

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
                <PaintRollerIcon strokeWidth={2} className="size-5.5" />
                Appearance
            </DropdownMenuItem>

            <PremiumThemeSelector open={open} onOpenChange={setOpen} />
        </React.Fragment>
    )
}
