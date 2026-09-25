import type { User } from "@/features/auth/schemas/user"
import { getAssemblyThemeColor } from "@/features/appearance/lib/assembly-theme"

export function usesRegionalShell(user?: User | null) {
    return Boolean(user?.uses_regional_shell && !user?.is_superuser)
}
export function workspaceThemeColor(user?: User | null) {
    return usesRegionalShell(user)
        ? getAssemblyThemeColor({ avatar_fallback: user?.active_regional_zone?.zone_avatar_fallback })
        : getAssemblyThemeColor(user?.assembly)
}
export function zoneSwitchHref(pathname: string, search: string, region: number) {
    const params = new URLSearchParams(search)
    params.delete("zone"); params.delete("country"); params.delete("region")
    const path = pathname.replace(/(\/regional-staff\/regions?\/)\d+/, `$1${region}`)
    return `${path}${params.size ? `?${params}` : ""}`
}
