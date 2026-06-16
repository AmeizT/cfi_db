"use client"

import { useTheme } from "next-themes"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { PremiumThemePreview } from "./ThemePreview"

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function PremiumThemeSelector({ open, onOpenChange }: Props) {
    const { theme, setTheme } = useTheme()

    const themes = ["light", "dark", "system"] as const

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl rounded-2xl">
                <DialogHeader>
                    <DialogTitle>
                        Appearance
                    </DialogTitle>

                    <DialogDescription className="text-[13px] text-mist-500">
                        Choose if CFI Database&apos;s appearance should be light or dark, or sync with your system.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-3 gap-6 mt-6">
                    {themes.map((t) => {
                        const active = theme === t

                        return (
                            <button
                                key={t}
                                onClick={() => setTheme(t)}
                                className={cn(
                                    "relative rounded-xl p-0.5 transition-all group",
                                    active
                                        ? "bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 animate-[gradientGlow_4s_ease_infinite]"
                                        : "bg-border"
                                )}
                            >
                                <div className="bg-background rounded-[10px] p-3">
                                    <PremiumThemePreview mode={t} />

                                    <div className="flex justify-between items-center mt-3 text-sm font-medium capitalize">
                                        {t}
                                        {active && <Check className="size-4 text-primary" />}
                                    </div>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </DialogContent>
        </Dialog>
    )
}