import { getAssemblyThemeColor } from "../lib/assembly-theme"
import { apiRoutes } from "@/config/urls"
import { isChurchAppearanceColor } from "../config/church-appearance-themes"

type UpdateChurchAppearanceInput = {
    publicId: string
    color: string
    colorField?: "avatar_fallback_color" | "avatar_fallback"
}

export async function updateChurchAppearance({ publicId, color, colorField = "avatar_fallback" }: UpdateChurchAppearanceInput) {
    if (!isChurchAppearanceColor(color)) {
        throw new Error("Unsupported church appearance theme.")
    }

    const response = await fetch(apiRoutes.assemblies.detail(publicId), {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [colorField]: color }),
    })

    if (!response.ok) throw new Error("Could not update church appearance")
    const assembly = await response.json() as { avatar_fallback_color?: string | null; avatar_fallback?: string | null }
    const savedColor = getAssemblyThemeColor(assembly)

    if (!savedColor || !isChurchAppearanceColor(savedColor)) {
        throw new Error("The server returned an unsupported church appearance theme.")
    }

    return { avatar_fallback: savedColor }
}
