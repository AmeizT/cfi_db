import { getChurchAppearanceTheme } from "../config/church-appearance-themes"
import { oklchLinearGradient, themeVariant } from "@/layouts/utils/get-oklch-gradient"

export const DEFAULT_CHURCH_THEME = "oklch(0.58 0.23 275)"

export function applyChurchTheme(color: string | null | undefined) {
    const theme = getChurchAppearanceTheme(color)
    const base = theme?.color ?? color ?? DEFAULT_CHURCH_THEME
    const foreground = theme?.foreground ?? "oklch(0.985 0 0)"
    const root = document.documentElement

    root.style.setProperty("--user-theme-600", base)
    root.style.setProperty("--user-theme", base)
    root.style.setProperty("--user-theme-foreground", foreground)
    root.style.setProperty("--shell-full-sidebar-background", oklchLinearGradient(base))
    root.style.setProperty("--user-theme-highlight", themeVariant(base, { lightness: 0.8 }))
}
