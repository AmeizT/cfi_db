import { apiRoutes } from "@/config/urls"
import { isChurchAppearanceColor } from "../config/church-appearance-themes"

type UpdateChurchAppearanceInput = {
    publicId: string
    color: string
}

export async function updateChurchAppearance({ publicId, color }: UpdateChurchAppearanceInput) {
    if (!isChurchAppearanceColor(color)) {
        throw new Error("Unsupported church appearance theme.")
    }

    const response = await fetch(apiRoutes.assemblies.detail(publicId), {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar_fallback: color }),
    })

    if (!response.ok) throw new Error("Could not update church appearance")
    const assembly = await response.json() as { avatar_fallback?: string | null }

    if (!assembly.avatar_fallback || !isChurchAppearanceColor(assembly.avatar_fallback)) {
        throw new Error("The server returned an unsupported church appearance theme.")
    }

    return { avatar_fallback: assembly.avatar_fallback }
}
