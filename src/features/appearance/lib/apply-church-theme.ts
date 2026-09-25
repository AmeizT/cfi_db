import { applySidebarForeground } from "./sidebar-foreground"
import { getChurchAppearanceTheme } from "../config/church-appearance-themes"
import { themeVariant } from "@/layouts/utils/get-oklch-gradient"

export const DEFAULT_CHURCH_THEME = "oklch(0.58 0.23 275)"

export function applyChurchTheme(color: string | null | undefined) {
    const theme = getChurchAppearanceTheme(color)
    const base = theme?.color ?? color ?? DEFAULT_CHURCH_THEME
    const foreground = theme?.foreground ?? "oklch(0.985 0 0)"
    const root = document.documentElement

    root.style.setProperty("--assembly-theme-600", base)
    root.style.setProperty("--assembly-theme", base)
    root.style.setProperty("--assembly-theme-foreground", foreground)
    root.style.setProperty("--assembly-theme-highlight", themeVariant(base, { lightness: 0.8 }))

    // Measure the derived active fill, rather than the raw assembly accent.
    const sidebarSurface = getComputedStyle(root).getPropertyValue("--assembly-sidebar-active").trim()
    applySidebarForeground(root, sidebarSurface || base)
}
