import type { RegionalFilters } from "./types"

export function regionalFilterParams(search: string, filters: RegionalFilters | undefined, key: string, value: string, period: string) {
    const params = new URLSearchParams(search)
    params.set("period", period)
    if (filters?.zone != null) params.set("zone", String(filters.zone))
    if (filters?.country) params.set("country", filters.country)
    params.set(key, value)
    if (key === "zone") {
        const countries = filters?.zones.find(zone => String(zone.id) === value)?.countries ?? []
        const current = params.get("country")
        if (current !== "all" && !countries.some(country => country.id === current)) {
            if (countries[0]) params.set("country", countries[0].id)
            else params.delete("country")
        }
    }
    return params
}
