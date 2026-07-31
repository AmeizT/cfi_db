"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { JethroLogo } from "./JethroLogo"
import { JethroPanel } from "./JethroPanel"

export function JethroLauncher() {
    const [open, setOpen] = useState(false)

    return (
        <>
            {open && (
                <JethroPanel onClose={() => setOpen(false)} />
            )}

            {!open && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            type="button"
                            aria-label="Open Jethro"
                            onClick={() => setOpen(true)}
                            className="
                                fixed right-4
                                bottom-[calc(5rem+env(safe-area-inset-bottom))]
                                z-50 size-14 rounded-full border
                                border-border-subtle bg-background/70
                                p-0 shadow-xl backdrop-blur-2xl
                                hover:bg-background/90
                                sm:right-6 sm:bottom-6
                            "
                        >
                            <JethroLogo className="size-11" />
                        </Button>
                    </TooltipTrigger>

                    <TooltipContent side="left">
                        Open Jethro
                    </TooltipContent>
                </Tooltip>
            )}
        </>
    )
}