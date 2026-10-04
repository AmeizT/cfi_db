"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { JethroLogo } from "./JethroLogo"
import { JethroPanel } from "./JethroPanel"
import { JethroComposer, type JethroComposerVariant } from "./JethroComposer"
import { useJethroSession } from "../JethroSessionProvider"

export function JethroLauncher({ variant }: { variant?: JethroComposerVariant }) {
    const pathname = usePathname()
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const { composer, setComposer, isSending, submitMessage } = useJethroSession()

    if (variant) {
        const startConversation = async () => {
            const id = await submitMessage(composer)
            if (id) router.push(`/ai?conversation=${encodeURIComponent(id)}`)
        }

        return (
            <JethroComposer
                value={composer}
                onChange={setComposer}
                onSubmit={() => void startConversation()}
                loading={isSending}
                variant={variant}
            />
        )
    }

    if (pathname === "/" || pathname === "/ai") return null

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
                                fixed right-[max(1rem,env(safe-area-inset-right))]
                                bottom-[calc(5.75rem+env(safe-area-inset-bottom))]
                                z-50 size-14 rounded-2xl border-0
                                border-border-subtle dark:border-neutral-700 bg-linear-to-b from-background to-background dark:from-neutral-800 dark:to-background
                                p-0 shadow-elevation-sm backdrop-blur-2xl
                                hover:bg-background/90
                                sm:right-[max(1.5rem,env(safe-area-inset-right))] md:bottom-[calc(1.5rem+env(safe-area-inset-bottom))]
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
