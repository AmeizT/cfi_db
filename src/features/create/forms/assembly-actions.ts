"use server"

import { cookies } from "next/headers"
import { getServerUrl } from "@/config/urls"
import { withJwt } from "@/config/headers"

export type AssemblyCreateOptions = {
    countries: { country: string; country_code: string; locale: string; currency: string }[]
    pastors: { id: number; name: string }[]
}

export async function getAssemblyCreateOptions(): Promise<AssemblyCreateOptions> {
    const token = (await cookies()).get("accessToken")?.value
    const response = await fetch(getServerUrl("api/v1/churches/assemblies/create-options"), { ...withJwt(token), cache: "no-store" })
    if (!response.ok) throw new Error("Unable to load Assembly creation options.")
    return response.json()
}

export async function createAssembly(data: FormData) {
    const token = (await cookies()).get("accessToken")?.value
    const headers = new Headers(withJwt(token).headers as HeadersInit)
    headers.delete("Content-Type")
    // Explicit allowlist: geographic defaults and zone are never client inputs.
    const body = new FormData()
    for (const key of ["name", "code", "description", "address", "city", "province", "country", "phone_number", "email", "status", "avatar", "avatar_fallback", "cover_image", "cover_image_position", "established_date", "assigned_pastors"]) {
        for (const value of data.getAll(key)) {
            if (value instanceof File ? value.size > 0 : value !== "") body.append(key, value)
        }
    }
    let response: Response
    try {
        response = await fetch(getServerUrl("api/v1/churches/assemblies"), { method: "POST", headers, body, cache: "no-store" })
    } catch {
        return { ok: false, uncertain: true, message: "The save could not be confirmed. Check the assemblies before trying again." }
    }
    if (!response.ok) {
        const errors = await response.json().catch(() => null)
        return { ok: false, uncertain: response.status >= 500, message: response.status === 403
            ? "You do not have permission to create an Assembly."
            : response.status >= 500 ? "The save could not be confirmed. Check the assemblies before trying again."
                : Object.entries(errors ?? {}).map(([field, error]) => `${field}: ${Array.isArray(error) ? error.join(" ") : String(error)}`).join(" · ") || "Assembly could not be created." }
    }
    return { ok: true, uncertain: false, message: "Assembly created" }
}
