"use client"

import { useTheme } from "next-themes"
import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUser } from "@/hooks/query/use-user"
import { churchAppearanceThemes } from "@/features/appearance/config/church-appearance-themes"
import { useChurchAppearance } from "@/features/appearance/hooks/use-church-appearance"
import { useShellColorMode } from "@/features/appearance/hooks/use-shell-color-mode"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const modes = [
    { key: "light", label: "Light", Icon: SunIcon },
    { key: "dark", label: "Dark", Icon: MoonIcon },
    { key: "system", label: "System", Icon: MonitorIcon },
] as const

export function PremiumThemeSelector({ open, onOpenChange }: Props) {
    const { theme, setTheme } = useTheme()
    const { data: user } = useUser()
    const appearance = useChurchAppearance()
    const { mode: shellColorMode, setMode: setShellColorMode } = useShellColorMode()
    const selectedMode = modes.some((mode) => mode.key === theme) ? theme : "system"
    const selectedColor = user?.assembly?.avatar_fallback
    const canManageChurchTheme = user?.can_manage_church_appearance ?? Boolean(user?.is_admin)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto rounded-2xl">
                <DialogHeader>
                    <DialogTitle>Appearance</DialogTitle>
                    <DialogDescription>
                        Choose your display mode and your church&apos;s shared color theme.
                    </DialogDescription>
                </DialogHeader>

                <section className="grid gap-3" aria-labelledby="display-mode-heading">
                    <h2 id="display-mode-heading" className="text-sm font-semibold">Display mode</h2>
                    <div className="grid grid-cols-3 rounded-lg bg-muted p-1" role="radiogroup" aria-label="Display mode">
                        {modes.map(({ key, label, Icon }) => {
                            const selected = selectedMode === key
                            return (
                                <button
                                    key={key}
                                    type="button"
                                    role="radio"
                                    aria-checked={selected}
                                    onClick={() => setTheme(key)}
                                    className={cn(
                                        "flex h-9 items-center justify-center gap-2 rounded-md text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                                        selected ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                                    )}
                                >
                                    <Icon className="size-4" />
                                    {label}
                                </button>
                            )
                        })}
                    </div>
                </section>

                <section className="grid gap-3" aria-labelledby="shell-color-heading">
                    <div>
                        <h2 id="shell-color-heading" className="text-sm font-semibold">Shell color</h2>
                        <p className="text-xs text-muted-foreground">Choose how strongly the church color fills the navigation shell.</p>
                    </div>
                    <div className="grid grid-cols-2 rounded-lg bg-muted p-1" role="radiogroup" aria-label="Shell color">
                        {([
                            { key: "light", label: "Light theme color" },
                            { key: "full", label: "Full theme color" },
                        ] as const).map((option) => {
                            const selected = shellColorMode === option.key
                            return (
                                <button
                                    key={option.key}
                                    type="button"
                                    role="radio"
                                    aria-checked={selected}
                                    onClick={() => setShellColorMode(option.key)}
                                    className={cn(
                                        "h-9 rounded-md px-3 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                                        selected ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                                    )}
                                >
                                    {option.label}
                                </button>
                            )
                        })}
                    </div>
                </section>

                <section className="grid gap-3" aria-labelledby="church-theme-heading">
                    <div>
                        <h2 id="church-theme-heading" className="text-sm font-semibold">Church theme</h2>
                        <p className="text-xs text-muted-foreground">
                            {canManageChurchTheme
                                ? "This color is shared by everyone using the active church."
                                : "Your church administrator manages this shared color."}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Church color theme">
                        {churchAppearanceThemes.map((option) => {
                            const selected = selectedColor === option.color
                            return (
                                <button
                                    key={option.key}
                                    type="button"
                                    role="radio"
                                    aria-checked={selected}
                                    disabled={!canManageChurchTheme || appearance.isPending}
                                    onClick={() => appearance.mutate(option.color)}
                                    className={cn(
                                        "relative flex min-h-16 items-center gap-2 rounded-lg border bg-card p-2 text-left text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-55",
                                        selected ? "border-primary ring-1 ring-primary" : "border-border hover:bg-accent",
                                    )}
                                >
                                    <span
                                        className="size-7 shrink-0 rounded-full border border-black/10 shadow-sm"
                                        style={{ backgroundColor: option.color }}
                                        aria-hidden="true"
                                    />
                                    <span className="leading-tight">{option.name}</span>
                                    {selected ? (
                                        <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                            <CheckIcon className="size-3" />
                                        </span>
                                    ) : null}
                                </button>
                            )
                        })}
                    </div>
                </section>
            </DialogContent>
        </Dialog>
    )
}
