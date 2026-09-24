type AssemblyAppearance = {
    avatar_fallback_color?: string | null
    avatar_fallback?: string | null
}

/** Prefer the assembly color field, while accepting the existing API spelling. */
export function getAssemblyThemeColor(assembly: AssemblyAppearance | null | undefined) {
    return assembly?.avatar_fallback_color ?? assembly?.avatar_fallback
}
