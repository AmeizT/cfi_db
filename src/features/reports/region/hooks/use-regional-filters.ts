"use client"

import * as React from "react"
import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation"
import type { ReadonlyURLSearchParams } from "next/navigation"
import type {
    RegionalModuleCountry,
    RegionalModuleResponse,
    RegionalModuleZone,
} from "../types/regional-modules"

type RegionalFilterQueryOptions = {
    pathname: string
    router: ReturnType<typeof useRouter>
    searchParams: ReadonlyURLSearchParams
    zoneId?: string | number | null
    country?: string | null
    replace?: boolean
}

export function getDefaultZone(
    data: RegionalModuleResponse | undefined
): RegionalModuleZone | undefined {
    return data?.zones?.[0]
}

export function getDefaultCountry(
    zone: RegionalModuleZone | undefined
): RegionalModuleCountry | undefined {
    return zone?.countries?.[0]
}

function getCountryOptions(
    zones: RegionalModuleZone[],
    selectedZone: RegionalModuleZone | undefined
) {
    if (selectedZone) {
        return selectedZone.countries ?? []
    }

    const countries = new Map<string, RegionalModuleCountry>()

    for (const zone of zones) {
        for (const country of zone.countries ?? []) {
            const existing = countries.get(country.name)

            if (!existing) {
                countries.set(country.name, {
                    ...country,
                    assemblies: [...(country.assemblies ?? [])],
                })
                continue
            }

            countries.set(country.name, {
                ...existing,
                assemblies: [
                    ...(existing.assemblies ?? []),
                    ...(country.assemblies ?? []),
                ],
            })
        }
    }

    return Array.from(countries.values()).sort((a, b) =>
        a.name.localeCompare(b.name)
    )
}

export function updateRegionalFilterQuery({
    pathname,
    router,
    searchParams,
    zoneId,
    country,
    replace = false,
}: RegionalFilterQueryOptions) {
    const params = new URLSearchParams(searchParams.toString())

    if (zoneId === null) {
        params.delete("zone")
    } else if (zoneId !== undefined) {
        params.set("zone", String(zoneId))
    }

    if (country === null) {
        params.delete("country")
    } else if (country !== undefined) {
        params.set("country", country)
    }

    if (!params.get("tab")) {
        params.set("tab", "reports")
    }

    const queryString = params.toString()
    const nextHref = queryString ? `${pathname}?${queryString}` : pathname

    if (replace) {
        router.replace(nextHref, { scroll: false })
    } else {
        router.push(nextHref, { scroll: false })
    }
}

export function useRegionalFilters(data: RegionalModuleResponse | undefined) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const zones = React.useMemo(() => data?.zones ?? [], [data?.zones])
    const zoneParam = searchParams.get("zone")
    const countryParam = searchParams.get("country")

    const selectedZone = React.useMemo(() => {
        if (!zoneParam) return undefined

        return zones.find((zone) => String(zone.id) === zoneParam)
    }, [zoneParam, zones])

    const countries = React.useMemo(
        () => getCountryOptions(zones, selectedZone),
        [selectedZone, zones]
    )

    const selectedCountry = React.useMemo(() => {
        if (!countryParam) return undefined

        return countries.find((country) => country.name === countryParam)
    }, [countries, countryParam])

    React.useEffect(() => {
        if (!data) return

        const hasValidZone = !zoneParam || Boolean(selectedZone)
        const hasValidCountry = !countryParam || Boolean(selectedCountry)

        if (hasValidZone && hasValidCountry && searchParams.get("tab")) return

        updateRegionalFilterQuery({
            pathname,
            router,
            searchParams,
            zoneId: hasValidZone ? undefined : null,
            country: hasValidCountry ? undefined : null,
            replace: true,
        })
    }, [
        countryParam,
        data,
        pathname,
        router,
        searchParams,
        selectedCountry,
        selectedZone,
        zoneParam,
    ])

    const setZone = React.useCallback(
        (zoneId: string) => {
            updateRegionalFilterQuery({
                pathname,
                router,
                searchParams,
                zoneId: zoneId === "all" ? null : zoneId,
                country: null,
            })
        },
        [pathname, router, searchParams]
    )

    const setCountry = React.useCallback(
        (country: string) => {
            updateRegionalFilterQuery({
                pathname,
                router,
                searchParams,
                country: country === "all" ? null : country,
            })
        },
        [pathname, router, searchParams]
    )

    return {
        zones,
        countries,
        selectedZone,
        selectedCountry,
        setZone,
        setCountry,
    }
}
