import { ReadonlyURLSearchParams } from "next/navigation"

export function updateQuery(
    searchParams: ReadonlyURLSearchParams,
    updates: Record<string, string | null>
) {
    const params = new URLSearchParams()

    Object.entries(searchParams).forEach(([key, value]) => {
        if (typeof value === "string") {
            params.set(key, value)
        }
    })

    Object.entries(updates).forEach(([key, value]) => {
        if (value === null) params.delete(key)
        else params.set(key, value)
    })

    return params.toString()
}