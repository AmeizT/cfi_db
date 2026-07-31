export const churchAppearanceThemes = [
    { key: "indigo", name: "Royal Indigo", color: "oklch(0.58 0.23 275)", foreground: "oklch(0.985 0 0)" },
    { key: "violet", name: "Vibrant Violet", color: "oklch(0.59 0.24 305)", foreground: "oklch(0.985 0 0)" },
    { key: "magenta", name: "Berry Bloom", color: "oklch(0.63 0.24 345)", foreground: "oklch(0.985 0 0)" },
    { key: "rose", name: "Radiant Rose", color: "oklch(0.65 0.22 20)", foreground: "oklch(0.985 0 0)" },
    { key: "orange", name: "Sunset Orange", color: "oklch(0.70 0.19 55)", foreground: "oklch(0.20 0.02 55)" },
    { key: "amber", name: "Golden Hour", color: "oklch(0.79 0.17 85)", foreground: "oklch(0.22 0.03 70)" },
    { key: "lime", name: "Lemon Lime", color: "oklch(0.75 0.19 125)", foreground: "oklch(0.22 0.04 125)" },
    { key: "emerald", name: "Fresh Emerald", color: "oklch(0.62 0.18 155)", foreground: "oklch(0.985 0 0)" },
    { key: "teal", name: "Ocean Teal", color: "oklch(0.61 0.16 185)", foreground: "oklch(0.985 0 0)" },
    { key: "cyan", name: "Electric Cyan", color: "oklch(0.68 0.16 220)", foreground: "oklch(0.16 0.03 220)" },
    { key: "blue", name: "Brilliant Blue", color: "oklch(0.59 0.22 255)", foreground: "oklch(0.985 0 0)" },
    { key: "coral", name: "Warm Coral", color: "oklch(0.72 0.17 30)", foreground: "oklch(0.22 0.03 30)" },
] as const

export type ChurchAppearanceTheme = (typeof churchAppearanceThemes)[number]

export function getChurchAppearanceTheme(color: string | null | undefined) {
    return churchAppearanceThemes.find((theme) => theme.color === color)
}

export function isChurchAppearanceColor(color: string): boolean {
    return churchAppearanceThemes.some((theme) => theme.color === color)
}
